'use strict';

const path = require('path');
const config = require('./config');
const logger = require('./logger');
const fsUtil = require('./utils/fsUtils');

const context = {

  cis: function(name) {
    const ctx = config.contexts[name];

    if (!ctx) {
      return false;
    }

    return require(ctx._module).check();
  },

  whoami: function() {
    const ami = [];
    for (const name in config.contexts) { //eslint-disable-line guard-for-in
      const cis = context.cis(name);
      logger.trace('checking if you are in a', '#bold', name, '-->', cis ? '#green' : '#red', cis);
      if (cis) {
        ami.push(name);
      }
    }
    return ami;
  }

};

module.exports = context;
