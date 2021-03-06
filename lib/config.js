'use strict';

const path = require('path');
const fs = require('fs');

const semver = require('semver');
const _ = require('lodash');
const versionUtils = require('./utils/versionUtils');
const requir = require('./utils/requirements');

const cmdParams = require('./params');
const logger = require('./logger');
const scullion = require('./globalScullion');
const constants = require('./utils/constants');

let initOptions = null;
let config = null;
let mergedConfig = null;

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
      if (added[name] === undefined) {
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
    .forEach((name) => {
      resConfig = _mergeUnit(resConfig, recipes[name]);
    });

  return resConfig;
};

const isInstalled = (cooked, requires) => {
  let installed = false;
  if (requires) {
    installed = true;
    if (requires !== constants.notBuild) {
      for (const module in requires) {
        if (cooked.recipes[module]) {
          const reqVersion = versionUtils.getVersion(requires[module]);
          if (reqVersion === true || semver.lte(reqVersion, cooked.recipes[module].version)) {
            logger.trace(module, '- versions: installed:', '#cyan', cooked.recipes[module].version, 'needed:', '#cyan', reqVersion, '#green', '- installed!');
          } else {
            logger.trace(module, '- versions: installed:', '#cyan', cooked.recipes[module].version, 'needed:', '#cyan', reqVersion, '#yellow', '- not installed!');
            installed = false;
          }
        } else {
          logger.trace(module, '#yellow', '- not installed!');
          installed = false;
        }
      }
    }
  }
  return installed;
};

const checkInstalled = (cooked) => {
  Object.getOwnPropertyNames(cooked.recipes).forEach((recipeName) => {
    if (cooked.recipes[recipeName].flows) {
      Object.getOwnPropertyNames(cooked.recipes[recipeName].flows).forEach((flowName) => {
        if (cooked.recipes[recipeName].flows[flowName].steps) {
          Object.getOwnPropertyNames(cooked.recipes[recipeName].flows[flowName].steps).forEach((stepName) => {
            for (const type in cooked.recipes[recipeName].flows[flowName].steps[stepName]) {
              if (isInstalled(cooked, cooked.recipes[recipeName].flows[flowName].steps[stepName][type].requires)) {
                cooked.recipes[recipeName].flows[flowName].steps[stepName][type].installed = true;
              }
            }
          });
        }
      });
    }
  });
  return cooked;
};

const addImplementations = (implementations, _config) => {
  if (implementations) {
    Object.getOwnPropertyNames(_config.recipes).forEach((recipeName) => {
      if (_config.recipes[recipeName].flows) {
        Object.getOwnPropertyNames(_config.recipes[recipeName].flows).forEach((flowName) => {
          Object.getOwnPropertyNames(_config.recipes[recipeName].flows[flowName].steps).forEach((stepName) => {
            if (implementations[stepName]) {
              Object.getOwnPropertyNames(implementations[stepName]).forEach((context) => {
                logger.trace('add requires from implementations ->', '#cyan', recipeName, 'flow:', '#green', flowName, 'step:', '#green', stepName, 'context:', '#cyan', context);
                _config.recipes[recipeName].flows[flowName].steps[stepName][context] = {
                  requires: implementations[stepName][context] === constants.notBuild ? constants.notBuild : versionUtils.line2Requires(implementations[stepName][context])
                };
              });
            }
          });
        });
      }
    });
  }
  return _config;
};

/**
 *
 * Builds a config object with all the configuration of one execution. This object is build in the begging of every execution and is use by all the piscosour elements.
 *
 */
const instantiate = function() {

  config = scullion.cook(initOptions);
  logger.debug('Scullion ends', '#green', 'Config is cooked:', JSON.stringify(config, null, 2));

  mergedConfig = _mergeConfig(config.recipes);

  config = addImplementations(mergedConfig.implementations, config);
  config = checkInstalled(config);

  mergedConfig.rootDir = process.cwd();
  mergedConfig.recipes = config.recipes;

  logger.debug('Merge ends', '#green', 'Merged Config: ', JSON.stringify(mergedConfig, null, 2));
};

const getConfig = () => {
  if (!config) {
    logger.trace('#green', 'Instanciate config');
    instantiate();
  }
  return config;
};

const _getGen = function(normal, type) {
  logger.silly('#green', 'config:_getGen -in-', normal, type);
  let obj;
  if (normal.recipe) {
    obj = getConfig().recipes[normal.recipe][type][normal.name];
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
  const localParams = _.get(getConfig(), 'recipes.configLocal.config.params', false);
  if (localParams) {
    params = _mergeObject(params, getConfig().recipes.configLocal.config.params);
  }
  return params;
};

const _normalStep = function(normal) {
  const normalCopy = _.clone(normal);
  normalCopy.origName = normal.name;
  normalCopy.name = normal.name.indexOf(':') >= 0 ? normal.name.split(':')[0] : normal.name;
  return normalCopy;
};

const allContexts = function() {
  const result = [];
  if (mergedConfig && mergedConfig.contexts) {
    Object.getOwnPropertyNames(mergedConfig.contexts).forEach((context) => result.push(context));
  }
  return result;
};

const getContexts = function(flow, recipeKey, strict) {
  let data = mergedConfig;
  const steps = mergedConfig.steps;
  let tmp = {};

  if (recipeKey) {
    data = getConfig().recipes[recipeKey];
  }

  Object.getOwnPropertyNames(mergedConfig.contexts).forEach(name => tmp[name] = 0);

  let def = 0;
  let total = 0;
  if (flow.steps) {
    Object.getOwnPropertyNames(flow.steps).forEach((name) => {
      total++;
      const step = _.merge(steps[name] || {}, flow.steps[name] || {});

      if (flow.steps[name].type === 'flow') {
        strict = false;
        total--;
      }

      Object.getOwnPropertyNames(step).forEach((type) => {
        if (type === 'default') {
          def++;
        }
        if (tmp[type] !== undefined) {
          tmp[type]++;
        }
      });
    });
  }

  const res = [];
  Object.getOwnPropertyNames(tmp).forEach((_type) => {
    if (strict) {
      if ((tmp[_type] + def) === total) {
        res.push(_type);
      }
    } else {
      if ((tmp[_type] + def) > 0) {
        res.push(_type);
      }
    }
  });
  return res;
};

const _getUniqueFlow = function(flowsIn, normal) {
  logger.trace('#green', '_getUniqueFlow', 'Obtaining flow by context');
  const flows = [];
  flowsIn.forEach((pair) => {
    const contexts = getContexts(pair.flow);
    if (_.intersection(normal.context, contexts).length > 0) {
      flows.push(pair);
    }
  });

  if (flows.length === 1) {
    flows[0].flow.recipe = flows[0].recipe;
    return flows[0].flow;
  }

  if (flows.length > 1) {
    let error = 'flow: "' + normal.name + '" Ambiguous for context "' + normal.context + '"!! steps are the same in multiple recipes: ';
    flows.forEach((pair) => {
      error += pair.recipe.name + ' version: ' + pair.recipe.version + ' | ';
    });
    throw new Error(error);
  }
  return;
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
  Object.getOwnPropertyNames(getConfig().recipes).forEach((name) => {
    const recipe = getConfig().recipes[name];
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
  Object.getOwnPropertyNames(getConfig().recipes).forEach((recipeName) => {
    const recipe = getConfig().recipes[recipeName];
    if (recipe.name && recipe.steps && recipe.steps[name]) {
      info.recipes.push({name: recipe.name, version: recipe.version, dir: recipe.dir});
      Object.getOwnPropertyNames(recipe.steps[name]).forEach((type) => {
        info.types.push(type === 'default' ? 'all' : type);
        info.description = recipe.steps[name][type].description;
      });
    }
  });
  return info;
};

const _getRequirements = function() {
  let requirements = {};
  Object.getOwnPropertyNames(getConfig().recipes).forEach((recipeName) => {
    const recipe = getConfig().recipes[recipeName];
    if (recipe.name && recipe.steps) {
      Object.getOwnPropertyNames(recipe.steps).forEach((name) => {
        Object.getOwnPropertyNames(recipe.steps[name]).forEach((type) => {
          if (recipe.steps[name][type].requirements) {
            Object.getOwnPropertyNames(recipe.steps[name][type].requirements).forEach((req) => {
              if (recipe.steps[name][type].requirements[req].version || requirements[req] && requirements[req].version) {
                if (!requirements[req]) {
                  requirements[req] = {version: undefined};
                }
                const versions = [recipe.steps[name][type].requirements[req].version, requirements[req].version];
                requirements[req].version = versionUtils.getMajor(versions);
              }
              requirements[req] = _mergeObject(recipe.steps[name][type].requirements[req], requirements[req]);
            });
          }
        });
      });
    }
  });

  const purged = {};
  Object.getOwnPropertyNames(mergedConfig.params.versions).forEach((req) => {
    if (requirements[req]) {
      purged[req] = mergedConfig.params.versions[req];
    }
  });

  return _mergeObject(purged, requirements);
};

const saveRequirements = function(filtered) {
  const requirements = _getRequirements();
  const allFathers = _mergeObject(requirements, mergedConfig.params.versions);
  const promises = [];
  Object.getOwnPropertyNames(requirements).forEach((req) => {
    if (filtered && requirements[req].installer) {
      delete requirements[req];
    } else {
      const options = allFathers[req];
      const father = allFathers[options.listedIn];
      promises.push(Promise.resolve()
        .then(() => requir.sh(req, options, father))
        .then((result) => requir.check(req, options, result, father), (result) => requir.check(req, options, result, father))
        .then((out) => {
          if (!out.uncheckable) {
            delete requirements[req];
          }
        })
        .catch((e) => e)
      );
    }
  });
  return Promise.all(promises)
    .then(() => {
      const fileName = 'requirements.json';
      logger.info('writing', '#green', fileName, 'for all installed steps');
      fs.writeFileSync(fileName, JSON.stringify(requirements, null, 2));
    });
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

  const contexts = _.clone(normal.context);
  const normalSteps = _.fromPairs(_.map(contexts, context => [context, _.merge(_.clone(normal), {context: context})]));
  const paramsSteps = _.fromPairs(_.map(normalSteps, normalStep => [normalStep.context, _getStep(normalStep)]));

  const applyMerger = (paramsStep) => {
    let params = _.cloneDeep(paramsStep);
    const localParams = _.get(getConfig(), `recipes.configLocal.config.steps.${normal.name}.params`, false);
    if (localParams) {
      params = _mergeObject(params, localParams);
    }
    return params;
  };

  const finalParams = _.fromPairs(_.map(normalSteps, normalStep => [normalStep.context, _precededParams(applyMerger(paramsSteps[normalStep.context]))]));
  logger.silly('#green', 'config:getStepParams -out-', finalParams);
  return finalParams;
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
const getFlowParams = function(normalStep, normalFlow) {
  logger.silly('#green', 'config:getFlowParams -in-', 'step:', normalStep, 'flow:', normalFlow);

  const contexts = _.clone(normalStep.context);
  const flow = getFlow(normalFlow);

  const normalsByContext = _.chain(contexts)
    .map(context => [
      context,
      _.chain(normalStep)
        .clone()
        .merge({ context: context }).value()
    ])
    .fromPairs().value();

  const stepsByContext = _.chain(normalsByContext)
    .filter(normalWithContext => normalWithContext.type !== 'flow')
    .map(normalWithContext => [normalWithContext.context, _getStep(normalWithContext)])
    .fromPairs().value();

  const priorityMergersByContext = _.chain(contexts)
    .map(context => [
      context,
      [
        _.get(flow, 'params', false),
        _.get(flow, `steps.${normalStep.name}.params`, false),
        _.get(flow, `steps.${normalStep.name}.${context}.params`, false),
        _.get(normalStep, `params.${context}`, false),
        _.get(getConfig(), `recipes.configLocal.config.flows.${normalFlow.name}.steps.${normalStep.name}.params`, false),
        _.get(getConfig(), `recipes.configLocal.config.steps.${normalStep.name}.params`, false),
        _.get(getConfig(), `recipes.configLocal.config.flows.${normalFlow.name}.params`, false)
      ]
    ])
    .fromPairs().value();

  const applyPriorities = (normalStep_, paramsStep) => {
    let merger = priorityMergersByContext[normalStep_.context] || [];
    let params = _.clone(paramsStep);
    merger.forEach(step => {
      if (step) {
        params = _mergeObject(params, step);
      }
    });

    return params;
  };

  const finalParams = _.chain(normalsByContext)
    .map(normalStep_ => [
      normalStep_.context,
      _precededParams(applyPriorities(normalStep_, stepsByContext[normalStep_.context]))
    ])
    .fromPairs().value();

  logger.silly('#green', 'config:getFlowParams -out- ', finalParams);

  return finalParams;
};

/**
 * obtain the location of a recipe in the fileSystem.
 *
 * @param name recipeKey
 * @returns String: Directory of one recipe
 */
const getDir = function(name) {
  let dir;
  if (getConfig().recipes[name]) {
    dir = getConfig().recipes[name].dir;
  }
  if (name === 'piscosour' && !dir) {
    dir = getConfig().recipes.module.dir;
  }
  return dir;
};

const _readStep = function(recipeName, normal) {
  const roots = [ getConfig().recipes[recipeName] ];

  if (normal.flowName && getConfig().recipes[recipeName].flows && getConfig().recipes[recipeName].flows[normal.flowName]) {
    roots.push(getConfig().recipes[recipeName].flows[normal.flowName]);
  }
  const result = roots.map((root) => {
    let step = _.get(root, `steps.${normal.name}.${normal.context}`, null);
    if (!step) {
      step = _.get(root, `steps.${normal.name}.default`, null);
    } else {
      step._context = normal.context;
    }
    return step;
  })
  .filter(element => element !== null);
  return result && result.length > 0 ? result[0] : null;
};

const _getFlowFromStep = function(normal) {
  return getFlow({
    name: normal.flowName,
    orig: `${normal.context}:${normal.flowName}`,
    context: [ normal.context ],
    flowName: normal.flowName
  });
};

const _loadStep = function(normal) {
  let tempStep = null;

  const found = Object.getOwnPropertyNames(getConfig().recipes)
    .reverse()
    .map((recipeName) => {
      let step = _readStep(recipeName, normal);

      if (step !== null) {

        logger.trace('#green', 'config:_loadStep', `step [${step._context ? step._context : 'default'}::${normal.name}] found in recipe: ${recipeName}`);
        logger.trace('#green', 'config:_loadStep module:', step._module ? step._module : 'not yet installed!!');

        if (tempStep) {
          if (step.requires && !tempStep.requires) {
            step = step.installed ? tempStep : step;
          } else {
            logger.trace('#yellow', 'step', '#bold', tempStep.name, '#red', 'is overwritten by step:', '#bold', step._module, 'in recipe:', recipeName);
          }
        }
        tempStep = step;

        if (step._module) {
          const context = step._context;
          step = require(step._module);
          step._context = context;
        }

        step._flow = _getFlowFromStep(normal);
        step.name = normal.name;
        step.params = normal.params;
        step.params.description = step.params.description || `Installing ${normal.name}`;
      } else {
        logger.trace('#green', 'config:_loadStep', `step [${normal.name}] not found in recipe: ${recipeName}`);
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
    plugins[pluginName] = Object.getOwnPropertyNames(getConfig().recipes)
      .reverse()
      .map((recipeName) => {
        const plugin = _.get(getConfig().recipes[recipeName], `plugins.${pluginName}`, {});

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

const or = (a, b) => a || b;

const isUninstalledStep = function(type, step) {
  return step[type] !== undefined && !step[type].installed && !_.isEmpty(step[type].requires);
};

const isUninstalledFlow = function(type, flow) {
  return _.chain(flow.steps)
    .map(step => isUninstalledStep(type, step))
    .reduce(or)
    .value();
};

const isInstalledFlow = function(type, flow) {
  const _type = type === undefined ? 'default' : type;
  return !isUninstalledFlow(_type, flow);
};

const isInstalledStep = function(type, step) {
  return !isUninstalledStep(type, step);
};

const getMergedConfig = () => {
  getConfig();
  return mergedConfig;
};

const finalConfig = {
  get: getMergedConfig,
  load: load,
  setOptions: (_options) => {
    initOptions = _options;
    return finalConfig;
  },
  refresh: instantiate,
  getDir: getDir,
  saveRequirements: saveRequirements,
  allContexts: allContexts,
  getContexts: getContexts,
  getFlow: getFlow,
  getFlowParams: getFlowParams,
  getStepInfo: getStepInfo,
  getStepParams: getStepParams,
  isAvailable: isAvailable,
  isInstalledFlow: isInstalledFlow,
  isInstalledStep: isInstalledStep,
  mergeObject: _mergeObject
};

module.exports = finalConfig;