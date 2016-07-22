'use strict';

const scullion = require('./scullion');
const logger = require('./logger');
const chef = require('./chef');
const path = require('path');
const fs = require('fs');
const fsUtils = require('./utils/fsUtils.js');

module.exports = {
  cacheFile() {
    return path.join(chef.getModuleDir(), chef.cacheFile);
  },
  writeCache() {
    const cacheFile = this.cacheFile();
    logger.trace('#green', 'writing', 'cached file', '#green', cacheFile);
    const cooked = scullion.cook(chef.getRecipes(true));
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