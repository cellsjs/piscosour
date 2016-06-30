'use strict';

const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const fsUtils = require('./utils/fsUtils');
const logger = require('./logger');
const Shot = require('./shot');
const Plugin = require('./plugin');
const cmdParams = require('./params');
const chef = require('./chef');
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

const _mergeUnit = function(lconfig, recipes, name) {
  const recipe = recipes[name];
  lconfig = _mergeObject(lconfig, recipe.config);
  lconfig.shots = _mergeObject(lconfig.shots, recipe.shots);
  lconfig.straws = _mergeObject(lconfig.straws, recipe.straws);

  return lconfig;
};

const _mergeConfig = function(recipes) {
  logger.silly('#green', 'config:_mergeConfig');
  let resConfig = {};

  Object.getOwnPropertyNames(recipes).forEach((name) => {
    const recipe = recipes[name];
    if (recipe.name && (name !== 'module' && name !== 'configLocal')) {
      resConfig = _mergeUnit(resConfig, recipes, name);
    }
  });

  resConfig = _mergeUnit(resConfig, recipes, 'module');
  resConfig = _mergeUnit(resConfig, recipes, 'configLocal');

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

  if (config.recipes.configLocal && config.recipes.configLocal.config && config.recipes.configLocal.config.params) {
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

const getRepoTypes = function(straw, recipeKey) {
  let data = mergedConfig;
  const shots = mergedConfig.shots;
  let tmp = {};

  if (recipeKey) {
    data = config.recipes[recipeKey].config;
  }
  if (data.repoTypes) {
    data.repoTypes.forEach((type) => {
      tmp[type] = 0;
    });
  }

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
    const repoTypes = getRepoTypes(pair.straw);
    if (repoTypes.indexOf(normal.repoType) >= 0) {
      straws.push(pair);
    }
  });

  if (straws.length === 1) {
    straws[0].straw.recipe = straws[0].recipe;
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
      info.recipes.push({name: recipe.name, version: recipe.version, dir: recipe.dir});
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
  if (config.recipes.configLocal.config && config.recipes.configLocal.config.shots && config.recipes.configLocal.config.shots[normal.name] && config.recipes.configLocal.config.shots[normal.name].params) {
    params = _mergeObject(params, config.recipes.configLocal.config.shots[normal.name].params);
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
  let params = _getShot(normalShot);
  params = _mergeObject(params, straw.params);
  if (straw.shots[normalShot.name]) {
    params = _mergeObject(params, straw.shots[normalShot.name].params);
  }
  if (straw.shots[normalShot.name] && straw.shots[normalShot.name][normalShot.repoType]) {
    params = _mergeObject(params, straw.shots[normalShot.name][normalShot.repoType].params);
  }
  if (config.recipes.configLocal.config && config.recipes.configLocal.config.straws  && config.recipes.configLocal.config.straws[normal.name] && config.recipes.configLocal.config.straws[normal.name].shots && config.recipes.configLocal.config.straws[normal.name].shots[normalShot.name] && config.recipes.configLocal.config.straws[normal.name].shots[normalShot.name].params) {
    params = _mergeObject(params, config.recipes.configLocal.config.straws[normal.name].shots[normalShot.name].params);
  }
  if (config.recipes.configLocal.config && config.recipes.configLocal.config.shots && config.recipes.configLocal.config.shots[normalShot.name] && config.recipes.configLocal.config.shots[normalShot.name].params) {
    params = _mergeObject(params, config.recipes.configLocal.config.shots[normalShot.name].params);
  }
  if (config.recipes.configLocal.config && config.recipes.configLocal.config.straws && config.recipes.configLocal.config.straws[normal.name] && config.recipes.configLocal.config.straws[normal.name].params) {
    params = _mergeObject(params, config.recipes.configLocal.config.straws[normal.name].params);
  }
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
  let filename = path.join(recipe.dir, 'shots', normal.name, normal.repoType, 'shot.js');
  let repoType = normal.repoType;
  logger.silly('#green', 'config:_loadOne -in-', filename);
  if (!fsUtils.exists(filename)) {
    logger.trace('#green', 'config:load', filename, 'doesn\'t exists!');
    repoType = undefined;
    filename = path.join(recipe.dir, 'shots', normal.name, 'shot.js');
  }
  logger.trace('#green', 'config:load', '[', normal.name, ']', filename, '...');

  if (fsUtils.exists(filename)) {
    if (shot._do) {
      logger.warn('#yellow', filename, '#red', 'is merged in shot:', '#bold', normal.origName, 'in recipe:', recipe.name);
    }

    try {
      shot = new Shot(_mergeObject(require(filename), shot));
      shot.name = normal.origName;
      shot.params = normal.params;
      if (repoType) {
        shot._repoType = repoType;
      }
    } catch (e) {
      logger.error('In', filename, '->', e);
    }
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
        const filename = path.join(recipe.dir, 'plugins', name, 'plugin.js');
        logger.silly('#green', 'config:loadPlugin -in-', filename);
        if (fsUtils.exists(filename)) {
          plugins[name] = new Plugin(_mergeObject(require(filename), plugins[name]));
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
  logger.trace('Scullion ends', '#green', 'Config is cooked:', JSON.stringify(config));

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
  mergedConfig.getRepoTypes = getRepoTypes;
  mergedConfig.recipes = config.recipes;
  mergedConfig.rootDir = config.rootDir;

  mergedConfig.mergeObject = _mergeObject;

  return mergedConfig;
}());