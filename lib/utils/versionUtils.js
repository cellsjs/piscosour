'use strict';

const semver = require('semver');

const util = {
  getVersion(str) {
    if (str.indexOf('git+') >= 0) {
      const items = str.match(/\#(.*?)$/);
      if (items && items.length > 0 && semver.valid(items[1])) {
        return items[1];
      } else {
        return true;
      }
    } else {
      return str.replace('^', '').replace('~', '');
    }
  }
};

module.exports = util;