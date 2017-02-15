'use strict';

const config = require('./config');
const logger = require('./logger');

const context = {

  cis: function(name, noCache) {
    const ctx = config.get().contexts[name];

    if (!ctx) {
      return false;
    }

    return require(ctx._module).check(noCache);
  },

  whoami: function(noCache) {
    const ami = [];
    for (const name in config.get().contexts) { //eslint-disable-line guard-for-in
      const cis = context.cis(name, noCache);
      logger.trace('checking if you are in a', '#bold', name, '-->', cis ? '#green' : '#red', cis);
      if (cis) {
        ami.push(name);
      }
    }
    return ami;
  }

};

module.exports = context;
