/*jshint node:true */

'use strict';

var config = require("./config"),
    logger = require("./logger"),
    params = require('./params'),
    moment = require('moment'),
    path = require("path"),
    fs = require('fs');

var shot;

var shooter = function(){

    /**
     * Execute one shot with conditions checks
     *
     * @param normal shot name
     */
    var execute = function(normal,resolve,reject) {
        logger.info("Piscosour shot","[","#bold",normal.orig,"]");
        shot = load(normal);
        shot.order = normal.order?normal.order:0;
        if (shot.do){
            logger.info("\n\n","#green",shot.runner.description,"\n");
            synchro(-1,resolve,reject);
        }else{
            reject('Shot "'+normal.name+'" is not defined for repository Type: "'+normal.repoType+'"');
        }
    };

    /**
     * Execute shot by shot recursively and synchronized!
     * @param n
     * @param resolve
     * @param reject
     */
    var synchro = function(n, resolve, reject){

        var onResolve = function (result) {

            //TODO: QUITAR +1 CUANDO SE HAGA LO DEL PLUGIN ya no habrá n = -1
            if (config.stages[n]) {
                var end = moment();
                shot.report({
                    status: 0,
                    message: (n+1)+"-"+config.stages[n],
                    content: result,
                    time: (end - shot.init),
                    order: shot.order,
                    last: n===config.stages.length-1
                });
            }

            if (result && result.skip)
                resolve();
            else
                synchro(n + 1, resolve, reject);
        };

        var onReject = function (err) {
            logger.error("#red", "shooter", "stop at", "#cyan", config.stages[n], "(", n, "of", config.stages.length, ")", JSON.stringify(err),err);
            var end = moment();

            shot.report({
                status: 1,
                message: (n+1)+"-"+config.stages[n],
                content: err.keep?err:err.toString(),
                time: (end-shot.init),
                order: shot.order,
                last: !err || !err.keep
            });

            if (err && err.keep)
                synchro(n + 1, resolve, reject);
            else
                reject(err);
        };

        //TODO: Meter esto en formato de plugin para añadir funcionalidad compartida
        if (n===-1){
            //Carga inicial de parametros de usuario para el shot dado
            if (shot.runner && shot.runner.params.prompts)
                shot.inquire("prompts").then(onResolve, onReject);
            else
                onResolve();
        }else if (n<config.stages.length) {
            logger.trace("#green", "shooter", "running", "#cyan", config.stages[n], "(", n, "of", config.stages.length, ")");

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
                    if (fs.statSync(filename)) {
                        shot = config.merge(require(filename), shot);
                        shot.runner.name = normal.name;
                        shot.runner.params = config.merge(normal.params,params.options);
                    }
                } catch (e) {
                    logger.trace("#red", "shooter:load", e);
                    if (e.syscall === 'stat')
                        errors.push(["#red", "shooter:load", "#yellow", filename, "doesn't exist!",e]);
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
            logger.trace.apply(logger, error);
        }
    };

    return {
        execute : execute
    }
};

module.exports = shooter();