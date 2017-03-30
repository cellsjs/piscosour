'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const semver = require('semver');

const chef = require('./chef');
const logger = require('./logger');
const scullion = require('./scullion');
const fsUtils = require('./utils/fsUtils.js');
const versionUtils = require('./utils/versionUtils.js');


function isInstalled(cooked, requires) {
  if (requires) {
    for (const module in requires) {
      if (cooked.recipes[module]) {
        const reqVersion = versionUtils.getVersion(requires[module]);
        if (reqVersion === true || semver.lte(reqVersion, cooked.recipes[module].version)) {
          logger.trace(module, '- versions: installed:', '#cyan', cooked.recipes[module].version, 'needed:', '#cyan', reqVersion, '#green', '- installed!');
          return true;
        } else {
          logger.trace(module, '- versions: installed:', '#cyan', cooked.recipes[module].version, 'needed:', '#cyan', reqVersion, '#yellow', '- not installed!');
        }
      } else {
        logger.trace(module, '#yellow', '- not installed!');
      }
    }
  }
  return false;
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
  cacheFile() {
    return path.join(chef.getModuleDir(), chef.cacheFile);
  },
  writeCache() {
    const cacheFile = this.cacheFile();
    logger.trace('#green', 'writing', 'cached file', '#green', cacheFile);
    const cooked = checkInstalled(this.addImplementations(scullion.cook(chef.getRecipes(true))));
    fs.writeFileSync(cacheFile, JSON.stringify(cooked, null, 2));
    return cooked;
  },
  addImplementations(cooked){
    if (cooked.recipes.module.config.implementations) {
      Object.getOwnPropertyNames(cooked.recipes).forEach((recipeName) => {
        Object.getOwnPropertyNames(cooked.recipes[recipeName].flows).forEach((flowName) => {
          Object.getOwnPropertyNames(cooked.recipes[recipeName].flows[flowName].steps).forEach((stepName) => {
            if (cooked.recipes.module.config.implementations[stepName]) {
              Object.getOwnPropertyNames(cooked.recipes.module.config.implementations[stepName]).forEach((context) => {
                logger.trace('add requires from implementations ->', '#cyan', recipeName,'flow:', '#green', flowName, 'step:', '#green', stepName, 'context:', '#cyan', context);
                cooked.recipes[recipeName].flows[flowName].steps[stepName][context] = {
                  requires : versionUtils.line2Requires(cooked.recipes.module.config.implementations[stepName][context])
                }
              });
            }
          });
        });
      });
    }
    return cooked;
  },
  cook() {
    let cooked;

//    const cacheFile = this.cacheFile();
//    if (fsUtils.exists(cacheFile)) {
//      logger.trace('#green', 'reading', 'cached file', '#green', cacheFile);
//      cooked = fsUtils.readConfig(cacheFile);
//    } else {

    cooked = this.writeCache();

//    }

    return _.merge(scullion.cook(chef.getLocalRecipes()), cooked);
  },
  get elements() {
    return scullion.elements;
  }
};