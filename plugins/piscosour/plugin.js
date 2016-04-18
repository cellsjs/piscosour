'use strict';

var piscosour = require('../..'),
    path = require('path'),
    fsUtils = require('../../lib/utils/fsUtils'),
    root = process.cwd(),
    pkgFile = path.join(root,'package.json'),
    piscoFile = path.join(root,'piscosour.json'),
    pkg = fsUtils.readConfig(pkgFile);

var config = require('../../lib/config');

module.exports = {
    description : "Piscosour config plugin",

    addons : {
        config : config,
        pkg : pkg,
        pkgFile : pkgFile,
        piscoFile : piscoFile

    }
};