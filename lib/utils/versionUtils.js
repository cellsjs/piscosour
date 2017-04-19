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
  },
  line2Requires(item){
    const by = ['@', '#'].filter((cut) => {
      return item.indexOf(cut) >= 0;
    }).pop();
    const array = item.split(by);
    const res = {};
    if (array.length === 2){
      res[array[0]] = array[1];
    } else {
      logger.warn('#yellow', item, '-> is not well defined!');
    }
    return res;
  }
};

module.exports = util;