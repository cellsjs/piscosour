'use strict';

const path = require('path');
const config = require('./config');
const logger = require('./logger');
const fsUtil = require('./utils/fsUtils');

const context = {

  _inRoot: function(fileName, workingDir) {
    fileName = fileName.replace('/', path.sep);
    fileName = path.join(config.rootDir, workingDir, fileName);
    return fsUtil.exists(fileName) ? fileName : undefined;
  },

  cis: function(name, workingDir) {
    const ctx = config.contexts[name];

    if (!ctx) {
      return false;
    }

    let nowWorkingDir = path.resolve(workingDir);
    let oldWorkingDir = process.cwd();

    process.chdir(nowWorkingDir);
    const result = require(ctx._module).check();
    process.chdir(oldWorkingDir);

    return result;
  },

  whoami: function(workingDir) {
    const ami = [];
    for (const name in config.contexts) { //eslint-disable-line guard-for-in
      const cis = context.cis(name, workingDir);
      logger.trace('checking if you are in a', '#bold', name, '-->', cis ? '#green' : '#red', cis);
      if (cis) {
        ami.push(name);
      }
    }
    return ami;
  }

};

module.exports = context;
