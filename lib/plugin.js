/*jshint node:true */

'use strict';

var Plugin = function(runner, logger, params){
    this.runner = runner;
    return this;
};

Plugin.prototype.setLogger = function(logger){
    this.runner.logger = logger;
};

Plugin.prototype.setParams = function(params){
    this.runner.params = params;
};

module.exports = Plugin;