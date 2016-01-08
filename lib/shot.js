/*jshint node:true */

'use strict';

var logger = require('./slife-logger');

var Shot = function(runner){
    this.runner = runner;
    return this;
};

Shot.prototype.do = function(stage,cb){
    logger.info("Do shot!",this.runner);
    this.runner[stage]();
    if (cb)
        cb();
};

module.exports = Shot;