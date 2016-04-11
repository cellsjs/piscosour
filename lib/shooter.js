/*jshint node:true */

'use strict';

var config = require("./config"),
    logger = require("./logger"),
    params = require('./params'),
    Waterfall = require('./utils/waterfall'),
    moment = require('moment'),
    path = require("path"),
    fs = require('fs');

/**
 *
 * Run one shot. Is the responsible to run all the stages of a shot.
 *
 * @returns {{execute: execute}}
 * @module shooter
 */
var shooter = function(){

    var shot;

    /**
     * Execute one shot with conditions checks
     *
     * @param normal shot name
     */
    var execute = function(normal,resolve,reject) {
        //logger.info("Piscosour shot","[","#bold",normal.orig,"]");
        shot = config.load(normal);
        shot.initShot = moment();
        shot.order = normal.order?normal.order:0;
        if (shot._do){
            logger.info("\n\n","#magenta","Starting","|","#green",shot.params.description,"| [","#bold",normal.orig,"]","\n");
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
            var end = moment();
            return {
                status: status,
                message: (n+1)+"-"+config.stages[n],
                content: content,
                time: (end - shot.init),
                order: shot.order,
                last: last
            };
        };

        var _resolve = function (result) {
            var isLast = n===config.stages.length-1;
            shot.report(_report(result,0,isLast));
            if (result && result.skip || isLast) {
                logger.info("\n\n","#magenta","Finished","|","#green",shot.params.description,"-","#duration",moment()-shot.initShot,"\n");
                resolve();
            }else
                synchro(n + 1, resolve, reject);
        };

        var _reject = function (err) {
            logger.error("#green", "shooter","error on", "#cyan", config.stages[n],"(", n, "of", config.stages.length, ")","#red","ERROR", (err.error || err));
            shot.report(_report(err,1,!err || !err.keep));
            if (err && err.keep)
                synchro(n + 1, resolve, reject);
            else {
                logger.info("\n\n","#magenta","Finished","|","#green",shot.params.description,"-","#duration",moment()-shot.initShot,"\n");
                reject(err);
            }
        };

        if (n<config.stages.length) {
            logger.trace("#green", "shooter", "running", "#cyan", config.stages[n], "(", n, "of", config.stages.length, ")");
            process.chdir(config.rootDir);

            var waterfall = new Waterfall({
                promises : [{
                    fn: shot._doPlugins,
                    args: [config.stages[n]],
                    obj: shot
                },{
                    fn: shot._do,
                    args: [config.stages[n]],
                    obj: shot
                }],
                logger: logger
            });

            waterfall.start().then(_resolve, _reject);
        }else
            resolve();
    };

    return {
        execute : execute
    }
};

module.exports = shooter();
