'use strict';

const fs = require('fs');
const path = require('path');

const chalk = require('chalk');
const _ = require('lodash');

const chef = require('./chef');
const cmdParams = require('./params');
const fsUtils = require('./utils/fsUtils');
const logger = require('./logger');
const Plugin = require('./plugin');
const scullion = require('./scullion');
const Shot = require('./shot');

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

  //TODO watch the plugins, maybe not to be merged
  scullion.elements.forEach(element => lconfig[element] = _mergeObject(lconfig[element], recipe[element]));

  return lconfig;
};

const _mergeConfig = function(recipes) {
  logger.silly('#green', 'config:_mergeConfig');
  let resConfig = {};

  Object.getOwnPropertyNames(recipes).forEach((name) => {
    const recipe = recipes[name];
    if (recipe.name && (name !== 'module' && name !== 'configLocal')) {
      resConfig = _mergeUnit(resConfig, recipes[name]);
    }
  });

  resConfig = _mergeUnit(resConfig, recipes.module);
  resConfig = _mergeUnit(resConfig, recipes.configLocal);

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

const _normalShot = function(normal) {
  const normalCopy = JSON.parse(JSON.stringify(normal));
  normalCopy.origName = normal.name;
  normalCopy.name = normal.name.indexOf(':') >= 0 ? normal.name.split(':')[0] : normal.name;
  return normalCopy;
};

const getContexts = function(straw, recipeKey) {
  let data = mergedConfig;
  const shots = mergedConfig.shots;
  let tmp = {};

  if (recipeKey) {
    data = config.recipes[recipeKey];
  }

  Object.getOwnPropertyNames(data.contexts).forEach(name => tmp[name] = 0);

  let def = 0;
  let total = 0;
  if (straw.shots) {
    Object.getOwnPropertyNames(straw.shots).forEach((name) => {
      total++;
      const shot = shots[name];

      if (straw.shots[name].type === 'straw') {
        total--;
      }

      for (const type in shot) {
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

const _getUniqueStraw = function(strawsIn, normal) {
  logger.trace('#green', '_getUniqueStraw', 'Obtaining straw by repoType');
  const straws = [];
  strawsIn.forEach((pair) => {
    const contexts = getContexts(pair.straw);
    if (contexts.indexOf(normal.repoType) >= 0) {
      straws.push(pair);
    }
  });

  if (straws.length === 1) {
    return straws[0].straw;
  }

  if (straws.length > 1) {
    let error = 'straw: "' + normal.name + '" Ambiguous for type "' + normal.repoType + '"!! shots has the same name in multiple recipes: ';
    straws.forEach((pair) => {
      error += pair.recipe.name + ' version: ' + pair.recipe.version + ' | ';
    });
    throw new Error(error);
  }
};

/**
 * Example inside a shot.
 *
 * ```
 * const straw = this.config.getStraw(normal);
 * ```
 * @param normal: Object with the repoType , name, recipeKey of the straw that you
 * @return Object with the configuration of a straw.
 */
const getStraw = function(normal) {
  const straws = [];
  Object.getOwnPropertyNames(config.recipes).forEach((name) => {
    const recipe = config.recipes[name];
    if (recipe.name && recipe.straws && recipe.straws[normal.name]) {
      straws.push({
        recipe: recipe,
        straw: recipe.straws[normal.name]
      });
    }
  });

  if (straws.length === 0) {
    return;
  }

  return straws.length === 1 ? straws[0].straw : _getUniqueStraw(straws, normal);
};

/**
 * normal has this aspect:
 *
 * ```
 * normal = {name: *, repoType: *, orig: *, recipe: *, isShot: *}
 * ```
 * Checks if a normal object is available in this recipe
 * @param normal
 * @returns {boolean}
 */
const isAvailable = function(normal) {
  let res = false;
  if (normal.isShot) {
    res = _getGen(normal, 'shots') !== undefined;
  } else {
    res = getStraw(normal) !== undefined;
  }

  logger.trace('#green', 'config:isAvailable:', normal, ':', res);
  return res;
};

/**
 * Obtain all information of a shot.
 *
 * @param name
 * @returns {{types: Array, recipes: Array, description: string}} types: All types where implementation is available, recipes: All recipes that this shot is implemented, description: Text describing this shot.
 */
const getShotInfo = function(name) {
  const info = {
    types: [],
    recipes: [],
    description: ''
  };
  Object.getOwnPropertyNames(config.recipes).forEach((recipeName) => {
    const recipe = config.recipes[recipeName];
    if (recipe.name && recipe.shots && recipe.shots[name]) {
      info.recipes.push({name: recipe.name, version: recipe.version});
      Object.getOwnPropertyNames(recipe.shots[name]).forEach((type) => {
        info.types.push(type === 'default' ? 'all' : type);
        info.description = recipe.shots[name][type].description;
      });
    }
  });
  return info;
};

const _getShot = function(normalIn) {
  logger.silly('#green', 'config:_getShot -in-', normalIn);
  const normal = _normalShot(normalIn);
  const globalShot = _getGen(normal, 'shots');
  if (globalShot) {
    let shot = globalShot.default;
    shot = _mergeObject(shot, globalShot[normal.repoType]);
    logger.silly('#green', 'config:_getShot -out-', shot);
    return shot;
  }
};

/**
 * set params in a shot context: with this order of preference
 * 1. .piscosour/piscosour.json
 * 2. your recipe piscosour.json
 * 3. params.json of default
 * 4. params.json of repoType
 * @param normal
 * @returns {*}
 */
const getShotParams = function(normal) {
  logger.silly('#green', 'config:getShotParams -in-', normal);
  let params = _getShot(normal);
  const localParams = _.get(config, `recipes.configLocal.config.shots.${normal.name}.params`);

  if (localParams) {
    params = _mergeObject(params, localParams);
  }

  params = _precededParams(params);
  logger.silly('#green', 'config:getShotParams -out-', params);
  return params;
};

/**
 * set params in a straw context: with this order of preference
 * 1. .piscosour/piscosour.json
 * 2. your recipe piscosour.json
 * 3. straw.json (3.1 - params, 3.2 - defaul, 3.3 - repoType)
 * 4. params.json of default
 * 5. params.json of repoType
 * @param normalShot
 * @param normal
 */
const getStrawParams = function(normalShot, normal) {
  logger.silly('#green', 'config:getStrawParams -in-', 'shot:', normalShot, 'straw:', normal);

  const straw = getStraw(normal);
  let params = _mergeObject(_getShot(normalShot), straw.params);

  const mergers = [
    _.get(straw, `shots.${normalShot.name}.params`),
    _.get(straw, `shots.${normalShot.name}.${normalShot.repoType}.params`),
    _.get(config, `recipes.configLocal.config.straws.${normal.name}.shots.${normalShot.name}.params`),
    _.get(config, `recipes.configLocal.config.shots.${normalShot.name}.params`),
    _.get(config, `recipes.configLocal.config.straws.${normal.name}.params`)
  ];

  mergers.forEach((merger) => {
    if (merger) {
      params = _mergeObject(params, merger);
    }
  });

  params = _precededParams(params);
  logger.silly('#green', 'config:getStrawParams -out- ', params);
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

const _loadOne = function(normal, recipe, shot) {
  if (recipe.shots[normal.name]) {
    let repoType = normal.repoType;
    let moduleName = '';

    if (!recipe.shots[normal.name][repoType]) {
      repoType = undefined;
      moduleName = recipe.shots[normal.name].default._module;
    } else {
      moduleName = recipe.shots[normal.name][repoType]._module;
    }
    logger.trace('#green', 'config:load', `shot [${repoType ? repoType : 'default'}::${normal.name}] found in recipe: ${recipe.name}`);
    logger.silly('#green', 'config:_loadOne -in-', moduleName);
    logger.trace('#green', 'config:load', '[', normal.name, ']', moduleName, '...');

    if (shot._do) {
      logger.warn('#yellow', moduleName, '#red', 'is merged in shot:', '#bold', normal.origName, 'in recipe:', recipe.name);
    }

    try {
      // shot = new Shot(_mergeObject(require(moduleName), shot));
      shot = new Shot(require(moduleName))
      shot.name = normal.origName;
      shot.params = normal.params;
      if (repoType) {
        shot._repoType = repoType;
      }
    } catch (e) {
      logger.error('In', moduleName, '->', e);
    }
  } else {
    logger.trace('#green', 'config:load', `shot [${normal.name}] not found in recipe: ${recipe.name}`);
  }

  logger.silly('#green', 'config:_loadOne -out-', shot);
  return shot;
};

const _setPlugins = function(shot, normal) {
  const plugins = {};
  Object.getOwnPropertyNames(config.recipes).forEach((recipeName) => {
    const recipe = config.recipes[recipeName];
    if (recipe.name && normal.params.plugins && normal.params.plugins.length > 0) {
      normal.params.plugins.forEach((name) => {
        if (recipe.plugins[name] && recipe.plugins[name]._module) {
          const moduleName = recipe.plugins[name]._module;
          logger.silly('#green', 'config:loadPlugin -in-', moduleName);
          plugins[name] = new Plugin(_mergeObject(require(moduleName), plugins[name]));
          if (plugins[name].addons) {
            logger.trace('Apply addons from plugin:', '#cyan', name);
            shot._augment(plugins[name].addons);
          }
        }

        logger.silly('#green', 'config:loadPlugin -out-', plugins ? plugins[name] : '');
      });
    }
  });
  shot.plugins = plugins;
  return shot;
};

/**
 * Instanciate a shot **new Shot** from all configurations in all recipes
 *
 * @param normal
 * @returns {{}} Object Shot, with all the plugins and configurations inyected
 */
const load = function(normal) {
  logger.silly('#green', 'config:load -in-', normal);
  const normalCopy = _normalShot(normal);
  normalCopy.params = cmdParams.merge(normal.params);
  let shot = {};
  Object.getOwnPropertyNames(config.recipes).forEach((name) => {
    const recipe = config.recipes[name];
    if (recipe.name) {
      shot = _loadOne(normalCopy, recipe, shot);
    }
  });
  if (shot._do) {
    shot = _setPlugins(shot, normalCopy);
  }
  logger.silly('#green', 'config:load -out-', shot);
  return shot;
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
  mergedConfig.getShotInfo = getShotInfo;
  mergedConfig.getStraw = getStraw;
  mergedConfig.isAvailable = isAvailable;
  mergedConfig.getShotParams = getShotParams;
  mergedConfig.getStrawParams = getStrawParams;
  mergedConfig.getContexts = getContexts;
  mergedConfig.recipes = config.recipes;
  mergedConfig.rootDir = config.rootDir;

  return mergedConfig;
}());
