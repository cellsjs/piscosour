'use strict';

const fs = require('fs');
const path = require('path');

const util = {
  createDir: function(dir) {
    if (!util.exists(dir)) {
      fs.mkdirSync(dir);
    }
  },

  exists: function(filename) {
    try {
      return fs.statSync(filename);
    } catch (e) {
      if (e.syscall === 'stat') {
        return false;
      } else {
        throw e;
      }
    }
  },

  readConfig: function(file, realEmpty) {
    let local = realEmpty ? {} : {empty: true};
    if (util.exists(file)) {
      local = JSON.parse(fs.readFileSync(file));
    }

    return local;
  },

  readFile: function(file) {
    let result = '';
    if (util.exists(file)) {
      result = fs.readFileSync(file);
    }
    return result;
  }

};

module.exports = util;