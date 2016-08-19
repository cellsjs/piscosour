'use strict';

const scullion = require('./scullion');
const logger = require('./logger');
const chef = require('./chef');
const path = require('path');
const fs = require('fs');
const fsUtils = require('./utils/fsUtils.js');
const versionUtils = require('./utils/versionUtils.js');
const semver = require('semver');


function isInstalled(cooked, requires) {
  if (requires) {
    for (const module in requires) {
      if (cooked.recipes[module]) {
        const reqVersion = versionUtils.getVersion(requires[module]);
        if (reqVersion === true || semver.gte(reqVersion, cooked.recipes[module].version)) {
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
    const cooked = checkInstalled(scullion.cook(chef.getRecipes(true)));
    fs.writeFileSync(cacheFile, JSON.stringify(cooked, null, 2));
  },
  cook() {
    const cacheFile = this.cacheFile();
    let cooked;
    if (fsUtils.exists(cacheFile)) {
      logger.trace('#green', 'reading', 'cached file', '#green', cacheFile);
      cooked = fsUtils.readConfig(cacheFile);
    } else {
      logger.warn('#yellow', 'cooking local recipes');
      cooked = scullion.cook(chef.getRecipes());
      fs.writeFileSync(cacheFile, JSON.stringify(cooked, null, 2));
    }
    return cooked;
  },
  get elements() {
    return scullion.elements;
  }
};