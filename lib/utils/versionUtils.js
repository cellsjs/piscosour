'use strict';

const semver = require('semver');

const util = {
  range2Version(range){
    return range.replace('^', '').replace('~', '');
  },
  getVersion(str) {
    if (str.indexOf('git+') >= 0) {
      const items = str.match(/\#(.*?)$/);
      if (items && items.length > 0 && semver.valid(items[1])) {
        return items[1];
      } else {
        return true;
      }
    } else {
      return this.range2Version(str);
    }
  },
  getMajor(rangesIn) {
    const ranges = {};
    let res = rangesIn
      .map((range) => {
        if (range) {
          const version = this.range2Version(range);
          ranges[version] = range;
          return version;
        }
      })
      .filter((version) => version !== undefined && semver.valid(version))
      .sort((a, b) => semver.gt(a, b))
      .pop();
    return ranges[res];
  }
};

module.exports = util;