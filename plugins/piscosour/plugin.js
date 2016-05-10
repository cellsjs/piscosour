'use strict';

var config = require('../../lib/config');
var Waterfall = require('../../lib/utils/waterfall');

module.exports = {
  description: 'Piscosour config plugin',

  addons: {
    config: config,
    pkgFile: 'package.json',
    piscoFile: 'piscosour.json',
    Waterfall: Waterfall
  }
};