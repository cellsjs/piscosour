'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const semver = require('semver');

const chef = require('./chef');
const logger = require('./logger');
const scullion = require('./scullion');
const fsUtils = require('./utils/fsUtils.js');
const constants = require('./utils/constants');
const versionUtils = require('./utils/versionUtils.js');


function isInstalled(cooked, requires) {
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
}

function checkInstalled(cooked) {
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
}

module.exports = {
  cacheEnabled: false,
  cacheFile() {
    return path.join(chef.getModuleDir(), chef.cacheFile);
  },
  _getRecipes(options) {
    options = options ? options : {isGlobal: true, isTest: false};
    return checkInstalled(this.addImplementations(scullion.cook(chef.getRecipes(options))));
  },
  writeCache() {
    const cooked = this._getRecipes();
    logger.trace('#green', 'writing', 'cached file', '#green', this.cacheFile());
    fs.writeFileSync(this.cacheFile(), JSON.stringify(cooked, null, 2));
    return cooked;
  },
  getCookedRecipes(options) {
    let cooked;
    if (this.cacheEnabled) {
      if (fsUtils.exists(this.cacheFile())) {
        logger.trace('#green', 'reading', 'cached file', '#green', this.cacheFile());
        cooked = fsUtils.readConfig(this.cacheFile());
      } else {
        cooked = this.writeCache();
      }
    } else {
      cooked = this._getRecipes(options);
    }
    return cooked;
  },
  addImplementations(cooked) {
    if (cooked.recipes.module.config.implementations) {
      Object.getOwnPropertyNames(cooked.recipes).forEach((recipeName) => {
        Object.getOwnPropertyNames(cooked.recipes[recipeName].flows).forEach((flowName) => {
          Object.getOwnPropertyNames(cooked.recipes[recipeName].flows[flowName].steps).forEach((stepName) => {
            if (cooked.recipes.module.config.implementations[stepName]) {
              Object.getOwnPropertyNames(cooked.recipes.module.config.implementations[stepName]).forEach((context) => {
                logger.trace('add requires from implementations ->', '#cyan', recipeName, 'flow:', '#green', flowName, 'step:', '#green', stepName, 'context:', '#cyan', context);
                cooked.recipes[recipeName].flows[flowName].steps[stepName][context] = {
                  requires: cooked.recipes.module.config.implementations[stepName][context] === constants.notBuild ? constants.notBuild : versionUtils.line2Requires(cooked.recipes.module.config.implementations[stepName][context])
                };
              });
            }
          });
        });
      });
    }
    return cooked;
  },
  cook(options) {
    return _.merge(scullion.cook(chef.getLocalRecipes()), this.getCookedRecipes(options));
  },
  get elements() {
    return scullion.elements;
  }
};