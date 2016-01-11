/*jshint node:true */

'use strict';

var logger = require("./logger");

var Repo = function(runner){
    this.runner = runner;
    return this;
};

Repo.prototype.do = function(stage,cb){
    logger.info("Do shot!",this.runner);
    this.runner[stage]();
    if (cb)
        cb();
};


module.exports = Repo;