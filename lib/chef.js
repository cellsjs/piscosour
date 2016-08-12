'use strict';

const path = require('path');
const fs = require('fs');
const logger = require('./logger');
const fsUtils = require('./utils/fsUtils.js');
const pwd = process.cwd();
const home = process.env.HOME ? process.env.HOME : process.env.HOMEPATH;
const semver = require('semver');
let piscoVersion;

const chef = function() {

  const _getModuleDir = function() {
    const objPath = path.parse(process.mainModule.filename);
    return objPath.dir.substring(0, objPath.dir.lastIndexOf(path.sep));
  };

  const addRecipe = (recipes, rootDir, isGlobal, isLocal) => {
    const pkgModule = fsUtils.readConfig(path.join(rootDir, 'package.json'));
    if (pkgModule.name) {
      logger.trace('processing:', '#green', pkgModule.name, 'piscosour version ->', pkgModule.dependencies ? pkgModule.dependencies.piscosour : '');
    }
    if (pkgModule.keywords && pkgModule.keywords.indexOf('piscosour-recipe') >= 0 && recipes.module.name !== pkgModule.name) {
      if (pkgModule.name === 'piscosour' || semver.satisfies(piscoVersion, pkgModule.dependencies.piscosour)) {
        logger.trace(pkgModule.name, '- recipe detected! - version:', pkgModule.version);
        recipes[pkgModule.name] = {
          name: pkgModule.name,
          version: pkgModule.version,
          description: pkgModule.description,
          dir: rootDir
        };
        if (isGlobal && pkgModule.dependencies) {
          Object.getOwnPropertyNames(pkgModule.dependencies).forEach((name) => addRecipe(recipes, path.join(rootDir, 'node_modules', name), isGlobal));
        }
      } else if (pkgModule.dependencies && pkgModule.dependencies.piscosour) {
        logger[isLocal ? 'warn' : 'trace']('#yellow', 'WARNING:', '#green', pkgModule.name, 'piscosour version ->', pkgModule.dependencies.piscosour, 'is not compatible with:', piscoVersion);
      }
    }
  };

  const getRecipes = function(isGlobal) {
    const rootDir = _getModuleDir();
    const recipes = {
      configLocal: {
        dir: path.join(pwd, '.piscosour')
      }
    };
    let file = path.join(pwd, '.piscosour', 'piscosour.json');
    if (fsUtils.exists(file)) {
      logger.trace('detecting:', '#green', file);
      recipes.configLocal = {
        name: 'pisco-local',
        description: 'Local Piscosour Recipe',
        version: '-',
        dir: path.join(pwd, '.piscosour')
      };
    }

    file = path.join(home, '.piscosour', 'piscosour.json');
    if (fsUtils.exists(file)) {
      logger.trace('detecting:', '#green', file);
      recipes.userConfig = {
        name: 'pisco-user',
        description: 'User Piscosour Recipe',
        version: '-',
        dir: path.join(home, '.piscosour')
      };
    }

    file = path.join(rootDir, 'package.json');
    if (fsUtils.exists(file)) {
      logger.trace('detecting:', '#green', file, '#magenta', 'getting all sons...');
      const pkg = fsUtils.readConfig(file);
      if (pkg.name === 'piscosour') {
        piscoVersion = pkg.version;
      } else if (pkg.dependencies.piscosour) {
        piscoVersion = pkg.dependencies.piscosour.replace('^', '').replace('~', '');
      }
      recipes.module = {
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        dir: rootDir
      };
      if (pkg.dependencies) {
        Object.getOwnPropertyNames(pkg.dependencies).forEach((name) => addRecipe(recipes, path.join(rootDir, 'node_modules', name), isGlobal, true));
      }
      if (isGlobal) {
        const dir = require('global-modules');
        fs.readdirSync(dir).forEach((subdir) => {
          addRecipe(recipes, path.join(dir, subdir), isGlobal);
        });
      }
    }

    return recipes;
  };

  return {
    getRecipes: getRecipes,
    getModuleDir: _getModuleDir,
    cacheFile: 'scullion.json'
  };
};

/**
 * **Internal:**
 *
 * Read all piscosour.json files of every recipes imported in one module and prepare one json object with all the information.
 *
 * This module is used only in module **config.js**
 *
 * @returns {{getRecipes: getRecipes}}
 * @module Chef
 */
module.exports = chef();