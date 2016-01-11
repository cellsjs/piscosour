/*jshint node:true */

'use strict';

var logger = require("./logger");

/**
 * Definition of a Shot
 * @param runner
 * @returns {Shot}
 * @constructor
 */
var Shot = function(runner){
    this.runner = runner;
    return this;
};

Shot.prototype.do = function(stage){
    var operation = this[stage];
    if (operation)
        return new Promise(function (resolve, reject){
            operation(resolve, reject);
        });
    else
        return;
};

module.exports = Shot;