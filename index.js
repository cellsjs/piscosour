/*jshint node:true */

'use strict';

var docs = require("./lib/slife-docs"),
    params = require("./lib/slife-params"),
    i18n = require("./lib/slife-i18n"),
    config = require("./lib/slife-config"),
    step = require("./lib/slife-step"),
    pipeline = require("./lib/slife-pipeline"),
    logger = require("./lib/slife-logger");

var messages = i18n.messages("/messages.json");

var Pisco = function(){

    /**
     * Handle all the commands of the utility
     * @returns {Promise}
     */
    var handle= function () {
        var promise = new Promise(function(resolve,reject){
            logger.trace("#green","slife-command:handle","params:",params.argv.remain);
            try {
                var normal = check(reject);

                if (normal) {
                    if (params.help) {
                        docs.help(params.step, params.argv.remain);
                        resolve(); //help is synchronous
                    } else {

                        for (var i in config.warnings){
                            logger.warn(config.warnings[i]);
                        }

                        logger.info(messages["producttype"],"[","#bold",normal.unitType,"]");

                        if (params.step) {
                            step.execute(normal,resolve,reject);
                        } else {
                            pipeline.execute(normal,params.initStep,params.endStep,resolve,reject);
                        }
                    }
                }
            } catch (e) {
                console.trace(e);
                reject(e);
            }
        });
        return promise;
    };

    /**
     * checks if the params is available and compatible with configurations
     * @param reject : callback function
     */
    var check = function(reject){
        logger.trace("#green","slife-command:check:","params:",params.argv.remain);
        var normal = normalize(params.argv.remain);
        if (isAvailable(normal)){
            return normal;
        }else {
            if (normal.name) {
                if (params.step)
                    logger.error(messages["step"], "#green", params.argv.remain, "#red", messages["notExists"]);
                else
                    logger.error(messages["pipeline"], "#green", params.argv.remain, "#red", messages["notExists"]);
                logger.txt("\n",messages["forhelp"],"\n");
                reject("command not available");
            }else {
                docs.help(params.step, []);
            }
            return;
        }

    };

    /**
     * Normalize command getting unitType
     *
     * @returns {{name: *, unitType: *, orig: *}}
     */
    var normalize = function(){
        logger.trace("#green","slife-command:normalize:","params:",params.argv.remain);
        var arg = params.argv.remain;
        if( Object.prototype.toString.call( arg ) === '[object Array]') {
            arg = arg[0];
            if (!arg) arg = "";
        }
        var normal = {};
        normal.orig = normal.name = arg;
        if (arg.indexOf(':')>0){
            var names = arg.split(':');
            normal.unitType = names[0];
            normal.name = names[1];
        }

        if (normal.unitType){
            var exists = config.unitTypes.find(function(unit){
                return unit===normal.unitType;
            });
            if (!exists){
                logger.warn("#yellow","WARNING:","#cyan",normal.unitType,messages["isnotproduct"],",",messages["default"]);
                normal.unitType = undefined;
            }
        };

        //if unitType is undefined
        normal.unitType = !normal.unitType?(!config.unitType?config.defaultType:config.unitType):normal.unitType;

        return normal;
    };

    /**
     * Checks if the command params exists
     */
    var isAvailable = function(normal){
        logger.trace("#green","slife-command:isAvailable:",normal);
        if (!normal.name)
            return false;
        if (params.step){
            for (var pipeline in config.pipelines){
                for (var step in config.pipelines[pipeline].steps){
                    if (step === normal.name)
                        return true;
                }
            }
        }else{
            for (var pipeline in config.pipelines){
                if (pipeline === normal.name) {
                    if (config.pipelines[pipeline].type!=='util')
                        return true;
                    else{
                        logger.error("#red", pipeline,messages['type'],"#cyan",config.pipelines[pipeline].type,messages['notExecutable']);
                        return false;
                    }
                }
            }
        }
        return false;
    };

    //Piscosour Interface
    return {
        handle: handle
    }
};

module.exports = Pisco;