/*jshint node:true */

'use strict';

var Shot = require("./lib/shot"),
    Sour = require("./lib/sour");

/**
 * Object containing all module functionality
 */
var Piscosour = {
    Shot: Shot,
    Sour: Sour
};

module.exports = Piscosour;