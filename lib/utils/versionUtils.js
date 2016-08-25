'use strict';

const semver = require('semver');

const util = {
  getVersion(str) {
    if (str.indexOf('git+') >= 0) {
      const items = str.match(/\#(.*?)$/);
      if (items) {
        const version = items[1];
        if (semver.valid(version)) {
          return version;
        } else {
          return true;
        }
      }
    } else {
      return str.replace('^', '').replace('~', '');
    }
  }
};

module.exports = util;