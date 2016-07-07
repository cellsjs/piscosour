'use strict';

const fs = require('fs');
const path = require('path');

const chalk = require('chalk');
const _ = require('lodash');

const chef = require('./chef');
const cmdParams = require('./params');
const fsUtils = require('./utils/fsUtils');
const logger = require('./logger');
const scullion = require('./scullion');

let config;
let mergedConfig;

/**
 * Merge two object. Added allways win. Thats means that in case of colision added is keeped.
 *
 * @param orig: Origin object
 * @param added: Object to be added, winning!
 * @returns {*} Object merged
 * @private
 */
const _mergeObject = function(orig, added) {
  logger.silly('#green', 'config:_mergeObject');
  if (orig === undefined) {
    orig = {};
  }
  if (added === undefined) {
    added = {};
  } else {
    added = JSON.parse(JSON.stringify(added));
  }
  for (const name in orig) {
    if (added[name] && Object.prototype.toString.call(added[name]) === '[object Object]') {
      added[name] = _mergeObject(orig[name], added[name]);
    } else if (added[name] && Object.prototype.toString.call(added[name]) === '[object Array]') {
      for (const i in orig[name]) {
        if (added[name].indexOf(orig[name][i]) < 0 && Object.prototype.toString.call(orig[name][i]) !== '[object Object]') {
          added[name].push(orig[name][i]);
        }
      }
    } else {
      if (!added[name]) {
        added[name] = orig[name];
      }
    }
  }
  return added;
};

const _mergeUnit = function(lconfig, recipe) {
  lconfig = _mergeObject(lconfig, recipe.config);
  scullion.elements.forEach(element => lconfig[element] = _mergeObject(lconfig[element], recipe[element]));

  return lconfig;
};

const _mergeConfig = function(recipes) {
  logger.silly('#green', 'config:_mergeConfig');
  let resConfig = {};

  Object.getOwnPropertyNames(recipes)
    .reverse()
    .forEach(name => resConfig = _mergeUnit(resConfig, recipes[name]));

  return resConfig;
};

const _getGen = function(normal, type) {
  logger.silly('#green', 'config:_getGen -in-', normal, type);
  let obj;
  if (normal.recipe) {
    obj = config.recipes[normal.recipe][type][normal.name];
  } else {
    obj = mergedConfig[type][normal.name];
  }
  logger.silly('#green', 'config:_getGen -out-', obj);
  return obj;
};

const _precededParams = function(params) {
  if (mergedConfig.params) {
    params = _mergeObject(params, mergedConfig.params);
  }
  const localParams = _.get(config, 'recipes.configLocal.config.params', false);
  if (localParams) {
    params = _mergeObject(params, config.recipes.configLocal.config.params);
  }
  return params;
};

const _normalStep = function(normal) {
  const normalCopy = JSON.parse(JSON.stringify(normal));
  normalCopy.origName = normal.name;
  normalCopy.name = normal.name.indexOf(':') >= 0 ? normal.name.split(':')[0] : normal.name;
  return normalCopy;
};

const getContexts = function(flow, recipeKey) {
  let data = mergedConfig;
  const steps = mergedConfig.steps;
  let tmp = {};

  if (recipeKey) {
    data = config.recipes[recipeKey];
  }

  Object.getOwnPropertyNames(mergedConfig.contexts).forEach(name => tmp[name] = 0);

  let def = 0;
  let total = 0;
  if (flow.steps) {
    Object.getOwnPropertyNames(flow.steps).forEach((name) => {
      total++;
      const step = steps[name];

      if (flow.steps[name].type === 'flow') {
        total--;
      }

      for (const type in step) {
        if (type === 'default') {
          def++;
        }
        if (tmp[type] !== undefined) {
          tmp[type]++;
        }
      }
    });
  }

  const res = [];
  Object.getOwnPropertyNames(tmp).forEach((_type) => {
    if ((tmp[_type] + def) === total) {
      res.push(_type);
    }
  });
  return res;
};

const _getUniqueFlow = function(flowsIn, normal) {
  logger.trace('#green', '_getUniqueFlow', 'Obtaining flow by context');
  const flows = [];
  flowsIn.forEach((pair) => {
    const contexts = getContexts(pair.flow);
    if (contexts.indexOf(normal.context) >= 0) {
      flows.push(pair);
    }
  });

  if (flows.length === 1) {
    return flows[0].flow;
  }

  if (flows.length > 1) {
    let error = 'flow: "' + normal.name + '" Ambiguous for type "' + normal.context + '"!! steps has the same name in multiple recipes: ';
    flows.forEach((pair) => {
      error += pair.recipe.name + ' version: ' + pair.recipe.version + ' | ';
    });
    throw new Error(error);
  }
};

/**
 * Example inside a step.
 *
 * ```
 * const flow = this.config.getFlow(normal);
 * ```
 * @param normal: Object with the context , name, recipeKey of the flow that you
 * @return Object with the configuration of a flow.
 */
const getFlow = function(normal) {
  const flows = [];
  Object.getOwnPropertyNames(config.recipes).forEach((name) => {
    const recipe = config.recipes[name];
    if (recipe.name && recipe.flows && recipe.flows[normal.name]) {
      flows.push({
        recipe: recipe,
        flow: recipe.flows[normal.name]
      });
    }
  });

  if (flows.length === 0) {
    return;
  }

  return flows.length === 1 ? flows[0].flow : _getUniqueFlow(flows, normal);
};

/**
 * normal has this aspect:
 *
 * ```
 * normal = {name: *, context: *, orig: *, recipe: *, isStep: *}
 * ```
 * Checks if a normal object is available in this recipe
 * @param normal
 * @returns {boolean}
 */
const isAvailable = function(normal) {
  let res = false;
  if (normal.isStep) {
    res = _getGen(normal, 'steps') !== undefined;
  } else {
    res = getFlow(normal) !== undefined;
  }

  logger.trace('#green', 'config:isAvailable:', normal, ':', res);
  return res;
};

/**
 * Obtain all information of a step.
 *
 * @param name
 * @returns {{types: Array, recipes: Array, description: string}} types: All types where implementation is available, recipes: All recipes that this step is implemented, description: Text describing this step.
 */
const getStepInfo = function(name) {
  const info = {
    types: [],
    recipes: [],
    description: ''
  };
  Object.getOwnPropertyNames(config.recipes).forEach((recipeName) => {
    const recipe = config.recipes[recipeName];
    if (recipe.name && recipe.steps && recipe.steps[name]) {
      info.recipes.push({name: recipe.name, version: recipe.version});
      Object.getOwnPropertyNames(recipe.steps[name]).forEach((type) => {
        info.types.push(type === 'default' ? 'all' : type);
        info.description = recipe.steps[name][type].description;
      });
    }
  });
  return info;
};

const _getStep = function(normalIn) {
  logger.silly('#green', 'config:_getStep -in-', normalIn);
  const normal = _normalStep(normalIn);
  const globalStep = _getGen(normal, 'steps');
  if (globalStep) {
    let step = globalStep.default;
    step = _mergeObject(step, globalStep[normal.context]);
    logger.silly('#green', 'config:_getStep -out-', step);
    return step;
  }
};

/**
 * set params in a step context: with this order of preference
 * 1. .piscosour/piscosour.json
 * 2. your recipe piscosour.json
 * 3. params.json of default
 * 4. params.json of context
 * @param normal
 * @returns {*}
 */
const getStepParams = function(normal) {
  logger.silly('#green', 'config:getStepParams -in-', normal);
  let params = _getStep(normal);
  const localParams = _.get(config, `recipes.configLocal.config.steps.${normal.name}.params`);

  if (localParams) {
    params = _mergeObject(params, localParams);
  }

  params = _precededParams(params);
  logger.silly('#green', 'config:getStepParams -out-', params);
  return params;
};

/**
 * set params in a flow context: with this order of preference
 * 1. .piscosour/piscosour.json
 * 2. your recipe piscosour.json
 * 3. flow.json (3.1 - params, 3.2 - defaul, 3.3 - context)
 * 4. params.json of default
 * 5. params.json of context
 * @param normalStep
 * @param normal
 */
const getFlowParams = function(normalStep, normal) {
  logger.silly('#green', 'config:getFlowParams -in-', 'step:', normalStep, 'flow:', normal);

  const flow = getFlow(normal);
  let params = _mergeObject(_getStep(normalStep), flow.params);

  const mergers = [
    _.get(flow, `steps.${normalStep.name}.params`, false),
    _.get(flow, `steps.${normalStep.name}.${normalStep.context}.params`, false),
    _.get(config, `recipes.configLocal.config.flows.${normal.name}.steps.${normalStep.name}.params`, false),
    _.get(config, `recipes.configLocal.config.steps.${normalStep.name}.params`, false),
    _.get(config, `recipes.configLocal.config.flows.${normal.name}.params`, false)
  ];

  mergers.forEach((merger) => {
    if (merger) {
      params = _mergeObject(params, merger);
    }
  });

  params = _precededParams(params);
  logger.silly('#green', 'config:getFlowParams -out- ', params);
  return params;
};

/**
 * obtain the location of a recipe in the fileSystem.
 *
 * @param name recipeKey
 * @returns String: Directory of one recipe
 */
const getDir = function(name) {
  let dir;
  if (config.recipes[name]) {
    dir = config.recipes[name].dir;
  }
  if (name === 'piscosour' && !dir) {
    dir = config.recipes.module.dir;
  }
  return dir;
};

const _loadStep = function(normal) {
  let tempStep = null;

  const found = Object.getOwnPropertyNames(config.recipes)
    .reverse()
    .map((recipeName) => {
      const stepContext = _.get(config.recipes[recipeName], `steps.${normal.name}.${normal.context}`, null);
      const stepDefault = _.get(config.recipes[recipeName], `steps.${normal.name}.default`, null);

      let step;
      let context;

      if (!stepContext && !stepDefault) {
        logger.trace('#green', 'config:_loadStep', `step [${normal.name}] not found in recipe: ${recipeName}`);
        return null;
      } else {
        if (stepContext) {
          step = stepContext;
          context = normal.context;
        } else {
          step = stepDefault;
          context = null;
        }
        logger.trace('#green', 'config:_loadStep', `step [${context ? context : 'default'}::${step.name}] found in recipe: ${recipeName}`);
        logger.trace('#green', 'config:_loadStep module:', step._module);

        if (tempStep) {
          logger.warn('#yellow', 'step', '#bold', tempStep.name, '#red', 'is overwritten by step:', '#bold', step._module, 'in recipe:', recipeName);
        }
        tempStep = step;

        step = require(step._module);
        step.name = normal.name;
        step.params = normal.params;
        step._context = context ? context : null;
      }

      return step;
    })
    .filter((element) => element !== null)
    .pop();

  return found || null;
};

const _loadPlugins = function(normal) {
  const plugins = {};
  const normalPlugins = _.get(normal, 'params.plugins', []);

  normalPlugins.forEach((pluginName) => {
    plugins[pluginName] = Object.getOwnPropertyNames(config.recipes)
      .reverse()
      .map((recipeName) => {
        const plugin = _.get(config.recipes[recipeName], `plugins.${pluginName}`, {});

        if (plugin._module) {
          logger.trace('#green', 'config:_loadPlugins plugin', pluginName, 'found in recipe:', recipeName);
          logger.trace('#green', 'config:_loadPlugins module:', plugin._module);
          if (plugins[pluginName]) {
            logger.warn('#yellow', 'plugin', '#bold', pluginName, '#red', 'is overwritten by:', '#bold', plugin._module, 'from recipe:', recipeName);
          }
          return require(plugin._module);
        }
        return null;
      })
      .filter(element => element !== null)
      .pop();
  });
  return plugins;
};

/**
 * Instantiate a step **new Step** from all configurations in all recipes
 *
 * @param normal
 * @returns {{}} Object Step, with all the plugins and configurations inyected
 */
const load = function(normal) {
  logger.silly('#green', 'config:load -in-', normal);

  const normalCopy = _normalStep(normal);
  normalCopy.params = cmdParams.merge(normal.params);

  const step = _loadStep(normalCopy);
  const plugins = _loadPlugins(normalCopy);

  logger.silly('#green', 'config:load -out step-', step);
  logger.silly('#green', 'config:load -out plugins-', plugins);

  return {
    step: step,
    plugins: plugins
  };
};

/**
 *
 * Builds a config object with all the configuration of one execution. This object is build in the begging of every execution and is use by all the piscosour elements.
 *
 */
module.exports = (function() {

  config = scullion.cook(chef.getRecipes());
  logger.trace('Scullion ends', '#green', 'Config is cooked:', JSON.stringify(config, null, 2));

  mergedConfig = _mergeConfig(config.recipes);
  logger.debug('Merge ends', '#green', 'Merged Config: ', JSON.stringify(mergedConfig));

  // Methods and exports definitions

  mergedConfig.load = load;
  mergedConfig.getDir = getDir;
  mergedConfig.getStepInfo = getStepInfo;
  mergedConfig.getFlow = getFlow;
  mergedConfig.isAvailable = isAvailable;
  mergedConfig.getStepParams = getStepParams;
  mergedConfig.getFlowParams = getFlowParams;
  mergedConfig.getContexts = getContexts;
  mergedConfig.recipes = config.recipes;
  mergedConfig.rootDir = config.rootDir;

  return mergedConfig;
}());
