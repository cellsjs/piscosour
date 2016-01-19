/*jshint node:true */

'use strict';

var config = require("./config"),
    logger = require("./logger"),
    path = require("path"),
    fs = require('fs'),
    i18n = require("./i18n");

var messages = i18n.messages("/messages.json");
var shot = {};

var shooter = function(){

    /**
     * Execute one shot with conditions checks
     *
     * @param normal shot name
     */
    var execute = function(normal,resolve,reject) {
        logger.info(messages["task"],"[","#bold",normal.orig,"]");

        shot = load(normal);
        logger.txt("\n",shot.runner.description,"\n");
        synchro(0,resolve,reject);
    };

    /**
     * Execute shot by shot recursively and synchronized!
     * @param n
     * @param resolve
     * @param reject
     */
    var synchro = function(n, resolve, reject){

        var onResolve = function (result) {
            if (result && result.skip)
                resolve();
            else
                synchro(n + 1, resolve, reject);
        };

        var onReject = function (err) {
            logger.error("#red", "shooter:synchro", messages["stops"], "#cyan", config.stages[n], "(", n, "of", config.stages.length, ")", err);
            if (err && err.keep)
                synchro(n + 1, resolve, reject);
            else
                reject(err);
        };

        if (n<config.stages.length) {
            logger.trace("#green", "shooter:synchro", messages["running"], "#cyan", config.stages[n], "(", n, "of", config.stages.length, ")");

            var promise = shot.do(config.stages[n]);

            if (promise)
                promise.then(onResolve, onReject);
            else
                onResolve();

        }else {
            resolve()
        };
    };

    //No se usa, lo dejo aquí por si en el futuro se me ocurre algo.
    var readShot = function(filename){
        eval('shot = '+fs.readFileSync(filename));
        return shot;
    };

    var load = function(normal){
        var errors = [];
        var shot = {};
        for (var name in config.modulesDir){
            if (!name.startsWith('c_')) {
                var filename = path.join(config.modulesDir[name], "shots", normal.name, normal.repoType, "shot.js");
                logger.trace("#green", "shooter:load", "trying", "[", name, "]", filename, "...");
                try {
                    shot = config.merge(require(filename), shot);
                    shot.runner.params = normal.params;

                } catch (e) {
                    logger.trace("#red", "shooter:load", e);
                    if (e.code === 'MODULE_NOT_FOUND')
                        errors.push(["#red", "shooter:load", "#yellow", filename, messages["notExists"]]);
                    else
                        logger.error("#red", "shooter:load", "#yellow", filename, e);
                }
            }
        }

        if (!shot.do)
            printErrors(errors);
        return shot;
    };

    var printErrors = function (errors){
        for (var i in errors){
            var error = errors[i];
            logger.error.apply(logger, error);
        }
    };

    return {
        execute : execute
    }
};

module.exports = shooter();