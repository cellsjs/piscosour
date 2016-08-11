'use strict';

const scullion = require('./scullion');
const logger = require('./logger');
const chef = require('./chef');
const path = require('path');
const fs = require('fs');
const fsUtils = require('./utils/fsUtils.js');
const semver = require('semver');


function getVersion(str) {
  if (str.indexOf('git+') >= 0) {
    const version = str.match(/\#(.*?)$/)[1];
    if (semver.valid(version)) {
      return version;
    } else {
      return true;
    }
  } else {
    return str.replace('^', '').replace('~', '');
  }
}

function isInstalled(cooked, requires) {
  if (requires) {
    for (const module in requires) {
      if (cooked.recipes[module]) {
        const reqVersion = getVersion(requires[module]);
        logger.trace(module, '- installed:', cooked.recipes[module].version, 'needed:', reqVersion);
        if (reqVersion === true || semver.gt(reqVersion, cooked.recipes[module].version)) {
          return true;
        }
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