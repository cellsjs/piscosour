'use strict';

var config = require('../../lib/config');
var Waterfall = require('../../lib/utils/waterfall');

module.exports = {
  addons: {
    piscoConfig: config,
    pkgFile: 'package.json',
    piscoFile: 'piscosour.json',
    Waterfall: Waterfall
  }
};
