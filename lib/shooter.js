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
        shot = config.load(normal);
        shot.order = normal.order?normal.order:0;
        if (shot.do){
            logger.info("\n\n","#green",shot.runner.description,"\n");
            synchro(0,resolve,reject);
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

        var _report = function(content, status,last){
            return {
                status: status,
                message: (n+1)+"-"+config.stages[n],
                content: content,
                time: (end - shot.init),
                order: shot.order,
                last: last
            };
        };

        var onResolve = function (result) {

            if (config.stages[n]) {
                var end = moment();
                shot.report(_report(result,0,n===config.stages.length-1));
            }

            if (result && result.skip)
                resolve();
            else
                synchro(n + 1, resolve, reject);
        };

        var onReject = function (err) {
            logger.error("#green", "shooter","stops on", "#cyan", config.stages[n],"(", n, "of", config.stages.length, ")","#red","ERROR", JSON.stringify(err),err);
            var end = moment();

            shot.report(_report(err,1,!err || !err.keep));

            if (err && err.keep)
                synchro(n + 1, resolve, reject);
            else
                reject(err);
        };

        //TODO: Meter esto en formato de plugin para añadir funcionalidad compartida
        if (n===-1){
            //Carga inicial de parametros de usuario para el shot dado
            if (shot.runner && shot.runner.params.prompts) {
                shot.inquire("prompts").then(onResolve, onReject);
            }else
                onResolve();
        }else if (n<config.stages.length) {
            logger.trace("#green", "shooter", "running", "#cyan", config.stages[n], "(", n, "of", config.stages.length, ")");

            process.chdir(config.rootDir);
            var promise = shot.do(config.stages[n]);

            if (promise)
                promise.then(onResolve, onReject);
            else
                onResolve({skipped:true});

        }else
            resolve()
    };

    return {
        execute : execute
    }
};

module.exports = shooter();