'use strict';

const config = require('./config');

module.exports = function(hook) {
  Object.assign(this, hook);
  return this;
};
