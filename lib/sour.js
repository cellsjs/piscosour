/*jshint node:true */

'use strict';

var docs = require("./docs"),
    path = require("path"),
    moment = require('moment'),
    config = require("./config"),
    shooter = require("./shooter"),
    params = require("./params"),
    finalCheck = require("./finalCheck"),
    sipper = require("./sipper"),
    logger = require("./logger");

/**
 * Sour is the commands line interface
 * @returns gush : execute the commands.
 * @constructor Sour
 */
var Sour = function(){

    var lastCheck = function(init){
        try{
            return finalCheck.run(init);
        }catch (e){
            logger.error(e.stack);
        }
    };

    /**
     * Execute all the commands of the utility
     * @returns {Promise}
     */
    var gush = function (init) {

        var promise = new Promise(function(resolve,reject){
            logger.trace("#green","sour:gush","commands:",params.commands);
            var xresolve = function(){
                var isOk = lastCheck(init);
                if (isOk)
                    resolve.apply(this, arguments);
                else
                    reject.apply(this, arguments);
            };

            var xreject = function(){
                lastCheck(init);
                reject.apply(this,arguments);
            };

            try {
                var normal = check(reject);
                if (normal) {
                    normal.init = init;
                    if (params.help) {
                        docs.help(normal);
                        resolve(); //help is synchronous
                    } else {
                        logger.info("Your repository type is:","[","#bold",normal.repoType,"]");

                        if (normal.isShot) {
                            normal.params = config.getShotParams(normal);
                            shooter.execute(normal,xresolve,xreject);

                        } else {
                            sipper.execute(normal,params.initShot,params.endShot,xresolve,xreject);
                        }
                    }
                }
            } catch (e) {
                console.error(e.stack);
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
        logger.trace("#green","sour:check:","commands:",params.commands);
        var normal = normalize(params.commands);
        if (config.isAvailable(normal)){
            return normal;
        }else {
            if (normal.name) {
                if (normal.isShot)
                    logger.error("shot", "#green", normal.orig, "#red", "doesn't exist!");
                else
                    logger.error("straw", "#green", normal.orig, "#red", "doesn't exist!");
                logger.txt("\n",config.cmd,"-la' for help.","\n");
                reject("command not available");
            } else {
                return defaultCmd(normal);
            }
        }

    };

    var defaultCmd = function(normal){
        if (config.defaultStraw && !params.help){
            normal.name = config.defaultStraw;
            normal.orig = config.defaultType;
            return normal;
        }else
            docs.help(normal);
    };

    /**
     * Normalize commands getting repoType
     *
     * @returns {{name: *, repoType: *, orig: *, recipe: *, isShot: *}}
     */
    var normalize = function(){
        logger.trace("#green","sour:normalize:","commands:",params.commands);
        var command = params.commands;

        if( Object.prototype.toString.call( command ) === '[object Array]') {
            command = command[0];
            if (!command) command = "";
        }

        var normal = {};

        normal.orig = normal.name = command;

        if (command.indexOf(':')>0){
            var names = command.split(':');
            normal.repoType = names[0];
            if (names.length===3){
                normal.isShot = true;
                normal.name = names[2];
            }else {
                normal.name = names[1];
            }
        }

        if (normal.repoType){
            var exists = config.repoTypes.find(function(unit){
                return unit===normal.repoType;
            });

            if (!exists){
                logger.warn("#yellow","WARNING:","#cyan",normal.repoType,"is not a software unit in the configuration",",","using default!");
                normal.repoType = undefined;
            }
        }

        //if repoType is undefined
        normal.repoType = !normal.repoType?(!config.repoType?config.defaultType:config.repoType):normal.repoType;

        params.normal = normal;

        return normal;
    };

    //Piscosour Interface
    return {
        gush: gush
    }
};

module.exports = Sour;