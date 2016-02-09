/*jshint node:true */

'use strict';

var config = require("./config"),
    logger = require("./logger"),
    params = require('./params'),
    path = require("path"),
    fs = require('fs');

var shot = {};

var shooter = function(){

    /**
     * Execute one shot with conditions checks
     *
     * @param normal shot name
     */
    var execute = function(normal,resolve,reject) {
        logger.info("Piscosour shot","[","#bold",normal.orig,"]");
        shot = load(normal);
        logger.info("\n\n","#green",shot.runner.description,"\n");
        synchro(-1,resolve,reject);
    };

    /**
     * Execute shot by shot recursively and synchronized!
     * @param n
     * @param resolve
     * @param reject
     */
    var synchro = function(n, resolve, reject){

        var onResolve = function (result) {

            //TODO: QUITAR CUANDO SE HAGA LO DEL PLUGIN ya no habrá n = -1
            if (config.stages[n])
                shot.report({status: 0, message: config.stages[n],content: result});

            if (result && result.skip)
                resolve();
            else
                synchro(n + 1, resolve, reject);
        };

        var onReject = function (err) {
            logger.error("#red", "shooter:synchro", "stop at", "#cyan", config.stages[n], "(", n, "of", config.stages.length, ")", JSON.stringify(err));
            shot.report({status: 1, message: config.stages[n],content: err});
            if (err && err.keep)
                synchro(n + 1, resolve, reject);
            else
                reject(err);
        };

        //TODO: Meter esto en formato de plugin para añadir funcionalidad compartida
        if (n===-1){
            //Carga inicial de parametros de usuario para el shot dado
            if (shot.runner.params.prompts)
                shot.inquire("prompts", onResolve);
            else
                onResolve();
        }else if (n<config.stages.length) {
            logger.trace("#green", "shooter:synchro", "running", "#cyan", config.stages[n], "(", n, "of", config.stages.length, ")");

            process.chdir(config.rootDir);
            var promise = shot.do(config.stages[n]);

            if (promise)
                promise.then(onResolve, onReject);
            else
                onResolve({skipped:true});

        }else {
            resolve()
        }
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
                    shot.runner.name = normal.name;
                    shot.runner.params = normal.params;
                } catch (e) {
                    logger.trace("#red", "shooter:load", e);
                    if (e.code === 'MODULE_NOT_FOUND')
                        errors.push(["#red", "shooter:load", "#yellow", filename, "doesn't exist!"]);
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