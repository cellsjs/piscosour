'use strict';

var config = require('../../lib/config');

module.exports = {
    description : "Piscosour config plugin",

    addons : {
        config : config,
        pkgFile : 'package.json',
        piscoFile : 'piscosour.json'

    }
};