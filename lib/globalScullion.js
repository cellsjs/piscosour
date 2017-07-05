'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');

const chef = require('./chef');
const logger = require('./logger');
const scullion = require('./scullion');
const fsUtils = require('./utils/fsUtils.js');
const versionUtils = require('./utils/versionUtils.js');

module.exports = {
  cacheEnabled: false,
  cacheFile() {
    return path.join(chef.getModuleDir(), chef.cacheFile);
  },
  _getRecipes(options) {
    options = options ? options : {isGlobal: true, isTest: false};
    return scullion.cook(chef.getRecipes(options));
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
  cook(options) {
    return _.merge(scullion.cook(chef.getLocalRecipes()), this.getCookedRecipes(options));
  },
  get elements() {
    return scullion.elements;
  }
};