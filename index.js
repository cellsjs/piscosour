/*jshint node:true */

'use strict';

var Shot = require("./lib/shot"),
    logger = require("./lib/logger"),
    config = require("./lib/config"),
    params = require("./lib/params"),
    Sour = require("./lib/sour");

/**
 * Object containing all module functionality
 */
var Piscosour = {
    Shot: Shot,
    Sour: Sour,
    logger: logger,
    config: config,
    params: params
};

module.exports = Piscosour;