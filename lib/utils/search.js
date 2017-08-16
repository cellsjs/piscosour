'use strict';

const fsUtils = require('./fsUtils');
const constants = require('./constants');
const path = require('path');
const logger = require('../logger');

const search = {
  searchNpm(filter, options) {
    const data = fsUtils.readConfig(constants.npmFile);
    let result = [];
    constants.npmDependencies.forEach((attribute) => {
      if (data && data[attribute]) {
        result = result.concat(Object.getOwnPropertyNames(data[attribute]).map((name) => {
          logger.trace('Looking into', name);
          return filter(fsUtils.readConfig(path.join(constants.npmFolder, name, constants.npmFile)), options);
        }).filter((element) => element));
      }
    });
    return result;
  },
  searchByKeyword(keyword) {
    const filter = (module, options) => {
      if (module.keywords && module.keywords.indexOf(options.keyword) >= 0) {
        return module;
      }
    };
    return search.searchNpm(filter, {keyword: keyword});
  }
};

module.exports = search;