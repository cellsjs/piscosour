/*jshint node:true */

'use strict';

var logger = require("./logger"),
    moment = require('moment'),
    Waterfall = require('./utils/waterfall');

/**
 * Definition of a Shot
 * @param runner
 * @returns {Shot}
 * @constructor
 */
var Shot = function(runner){
    this.logger = logger;
    this.plugins = {};
    this.runner = {};
    this.augment(runner, 'runner');
    
    return this;
};

Shot.prototype.augment = function(which, namespace) {
    let target = namespace ? this[namespace] : this;
    
    for (let name in which) {
      if (typeof which[name] === 'function') {
        target[name] = which[name].bind(this);
      } else {
        target[name] = which[name];
      }
    }  
};

Shot.prototype.do = function(stage){
    this.init = moment();
    let operation = this.runner[stage];
    if (operation) {
        var promise = new Promise(function (resolve, reject) {
            if (!operation(resolve, reject)) {
                logger.trace("auto-resolve is called!");
                resolve();
            }
        });
        return promise;
    }else
        return;
};

Shot.prototype.doPlugins = function(stage){
    logger.silly("doPlugins -in-", stage);
    let promises = [];
    for (var name in this.plugins){
        var plugin = this.plugins[name];
        var operation = plugin[stage];

        if (operation) {
            promises.push({
                fn: operation.bind(this),
                args: [],
                obj: null
            });
        };
    };
    var waterfall = new Waterfall({
        promises: promises,
        logger: logger
    });
    logger.silly("doPlugins -out-", promises.length);
    return waterfall.start();
};

//------------------------------------------

Shot.prototype.report = function(result) {
    if (!global[this.name])
        global[this.name] = {};

    var report = global[this.name]["xxreport"];
    if (!report)
        report = {
            name: this.name,
            description : this.runner.description,
            results : [],
            timestamp : new Date(),
            time : moment()
        };

    if (result && result.last)
        report.time = moment() - report.time;

    report.results.push(result);
    global[this.name]["xxreport"] = report;
};

Shot.prototype.save = function(key,obj, isGlobal) {
    var context = isGlobal?"piscosour":this.name;
    if (!global[context])
        global[context] = {};

    global[context][key] = obj;
};

Shot.prototype.get = function(key, shotName) {
    if (!shotName)
        shotName = "piscosour";
    if (global[shotName])
        return global[shotName][key];
};

module.exports = Shot;