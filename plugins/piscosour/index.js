'use strict';

var config = require('../../lib/config');
var Waterfall = require('../../lib/utils/waterfall');
const constants = require('../../lib/utils/constants');

module.exports = {
  addons: {
    piscoConstants: constants,
    piscoConfig: config,
    pkgFile: constants.npmFile,
    piscoFile: constants.piscoFile,
    Waterfall: Waterfall
  }
};
