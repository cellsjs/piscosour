'use strict';

const path = require('path');
const fs = require('fs');
const logger = require('./logger');
const fsUtils = require('./utils/fsUtils.js');
const pwd = process.cwd();

const chef = function() {

  const _getModuleDir = function() {
    const objPath = path.parse(process.mainModule.filename);
    return objPath.dir.substring(0, objPath.dir.lastIndexOf(path.sep));
  };

  const getRecipes = function() {
    const rootDir = _getModuleDir();
    const file = path.join(rootDir, 'package.json');
    logger.trace('Chef is reading all recipes from ', '#magenta', file);
    const recipes = {
      configLocal: {
        dir: path.join(pwd, '.piscosour')
      }
    };

    const localFile = path.join(pwd, '.piscosour', 'piscosour.json');
    if (fsUtils.exists(localFile)) {
      recipes.configLocal = {
        name: 'pisco-local',
        description: 'Piscosour Local Recipe',
        version: '-',
        dir: path.join(pwd, '.piscosour')
      };
    }

    if (fsUtils.exists(file)) {
      const pkg = fsUtils.readConfig(file);
      recipes.module = {
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        dir: rootDir
      };
      if (pkg.dependencies) {
        Object.getOwnPropertyNames(pkg.dependencies).forEach((name) => {
          const moduleFile = path.join(rootDir, 'node_modules', name, 'package.json');
          const pkgModule = fsUtils.readConfig(path.join(moduleFile));
          if (!pkgModule) {
            logger.error('#red', moduleFile, 'doesn\'t exists!');
          } else if (pkgModule.keywords && pkgModule.keywords.indexOf('piscosour-recipe') >= 0) {
            logger.trace(name, '- recipe detected! - version:', pkgModule.version);
            recipes[name] = {
              name: name,
              version: pkgModule.version,
              description: pkgModule.description,
              dir: path.join(rootDir, 'node_modules', name)
            };
          }
        });
      }
    }

    return recipes;
  };

  return {
    getRecipes: getRecipes
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