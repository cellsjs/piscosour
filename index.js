/*jshint node:true */

'use strict';

var Shot = require("./lib/shot"),
    logger = require("./lib/logger"),
    Sour = require("./lib/sour");

/**
 * Object containing all module functionality
 */
var Piscosour = {
    Shot: Shot,
    Sour: Sour,
    logger: logger
};

module.exports = Piscosour;