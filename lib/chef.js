'use strict';

const path = require('path');
const fs = require('fs');
const logger = require('./logger');
const fsUtils = require('./utils/fsUtils');
const constants = require('./utils/constants');
const versionUtils = require('./utils/versionUtils');
const pwd = process.cwd();
const home = require('os').homedir();
const semver = require('semver');
let toolVersion;

const chef = function() {

  const _getModuleDir = function() {
    const objPath = path.parse(process.mainModule.filename);
    return objPath.dir.substring(0, objPath.dir.lastIndexOf(path.sep));
  };

  const toolRangeVersion = (pkgModule) => {
    return pkgModule.devDependencies && pkgModule.devDependencies[constants.toolName] ?
      pkgModule.devDependencies[constants.toolName] : pkgModule.dependencies &&
      pkgModule.dependencies[constants.toolName] ? pkgModule.dependencies[constants.toolName] : '';
  };

  const addRecipe = (recipes, rootDir, isGlobal, isLocal) => {
    const pkgModule = fsUtils.readConfig(path.join(rootDir, constants.npmFile));
    const pkgToolRangeVersion = toolRangeVersion(pkgModule);

    const satisfies = (version, range) => {
      if (version && version.indexOf('-') >= 0) {
        version = version.split('-')[0];
      }
      return semver.satisfies(version, range);
    };

    if (pkgModule.name) {
      logger.trace('processing:', '#green', pkgModule.name, constants.toolName,'version ->', pkgToolRangeVersion);
    }
    if (pkgModule.keywords && pkgModule.keywords.indexOf(constants.toolKeyword) >= 0 && recipes.module.name !== pkgModule.name) {
      if ((pkgModule.name === constants.toolName && isLocal || satisfies(toolVersion, pkgToolRangeVersion)) && !recipes[pkgModule.name]) {
        logger.trace(pkgModule.name, '- recipe detected! - version:', pkgModule.version);
        recipes[pkgModule.name] = {
          name: pkgModule.name,
          version: pkgModule.version,
          description: pkgModule.description,
          dir: rootDir
        };
        if (isGlobal && pkgModule.dependencies !== undefined) {
          Object.getOwnPropertyNames(pkgModule.dependencies).forEach((name) => {
            addRecipe(recipes, path.join(rootDir.substring(0, rootDir.lastIndexOf(path.sep)), name), isGlobal, isLocal);
            addRecipe(recipes, path.join(rootDir, 'node_modules', name), isGlobal, isLocal);
          });
        }
      } else if (pkgModule.dependencies && pkgModule.dependencies[constants.toolName] && !semver.satisfies(toolVersion, pkgToolRangeVersion)) {
        logger[isLocal ? 'error' : 'trace'](isLocal ? '#red' : '#yellow', isLocal ? 'ERROR' : 'WARNING:', '#green', pkgModule.name, constants.toolName, 'version ->', pkgToolRangeVersion, 'is not compatible with:', toolVersion);
      }
    }
  };

  const getLocalRecipes = function() {
    const recipes = {
      configLocal: {
        dir: path.join(pwd, constants.toolLocalDir)
      }
    };
    let file = path.join(pwd, constants.toolLocalDir, constants.toolFile);
    if (fsUtils.exists(file)) {
      logger.trace('detecting:', '#green', file);
      recipes.configLocal = {
        name: `${constants.toolName}-local`,
        description: `Local ${constants.toolName} Recipe`,
        version: '-',
        dir: path.join(pwd, constants.toolLocalDir)
      };
    }
    return recipes;
  };

  const getRecipes = function(options) {
    const rootDir = options.isTest ? process.cwd() : _getModuleDir();
    const recipes = {};
    let file = path.join(home, constants.toolLocalDir, constants.toolFile);
    if (fsUtils.exists(file)) {
      logger.trace('detecting:', '#green', file);
      recipes.userConfig = {
        name: `${constants.toolName}-user`,
        description: `User ${constants.toolName} Recipe`,
        version: '-',
        dir: path.join(home, constants.toolLocalDir)
      };
    }

    file = path.join(rootDir, constants.npmFile);
    if (fsUtils.exists(file)) {
      logger.trace('detecting:', '#green', file, '#magenta', 'getting all sons...');
      const pkg = fsUtils.readConfig(file);
      if (pkg.name === constants.toolName) {
        toolVersion = pkg.version;
      } else if (pkg.dependencies && pkg.dependencies[constants.toolName]) {
        toolVersion = versionUtils.getVersion(pkg.dependencies[constants.toolName]);
      } else if (pkg.devDependencies && pkg.devDependencies[constants.toolName]) {
        toolVersion = versionUtils.getVersion(pkg.devDependencies[constants.toolName]);
      }
      recipes.module = {
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        dir: rootDir
      };
      if (pkg.dependencies) {
        Object.getOwnPropertyNames(pkg.dependencies).forEach((name) => addRecipe(recipes, path.join(rootDir, 'node_modules', name), options.isGlobal, true));
      }
      if (pkg.devDependencies) {
        Object.getOwnPropertyNames(pkg.devDependencies).forEach((name) => addRecipe(recipes, path.join(rootDir, 'node_modules', name), options.isGlobal, true));
      }
      if (options.isGlobal) {
        const dir = require('global-modules');
        fs.readdirSync(dir).forEach((subdir) => {
          addRecipe(recipes, path.join(dir, subdir), options.isGlobal);
        });
      }
    }

    return recipes;
  };

  return {
    getRecipes: getRecipes,
    getLocalRecipes: getLocalRecipes,
    getModuleDir: _getModuleDir,
    cacheFile: 'scullion.json'
  };
};

/**
 * **Internal:**
 *
 * Read all toolFile.json files of every recipes imported in one module and prepare one json object with all the information.
 *
 * This module is used only in module **config.js**
 *
 * @returns {{getRecipes: getRecipes}}
 * @module Chef
 */
module.exports = chef();