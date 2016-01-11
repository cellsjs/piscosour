/*jshint node:true */

'use strict';

var docs = require("./docs"),
    i18n = require("./i18n"),
    config = require("./config"),
    shooter = require("./shooter"),
    sipper = require("./sipper"),
    logger = require("./logger");

var messages = i18n.messages("/messages.json");


/**
 * Sour is the command line interface
 * @returns gush : execute the command.
 * @constructor Object params obtained from command line using nopt module.
 */
var Sour = function(params){

    /**
     * Execute all the commands of the utility
     * @returns {Promise}
     */
    var gush = function () {
        var promise = new Promise(function(resolve,reject){
            logger.trace("#green","sour:gush","params:",params.argv.remain);
            try {
                var normal = check(reject);

                if (normal) {
                    if (params.help) {
                        docs.help(params.shot, params.argv.remain);
                        resolve(); //help is synchronous
                    } else {

                        for (var i in config.warnings){
                            logger.warn(config.warnings[i]);
                        }

                        logger.info(messages["producttype"],"[","#bold",normal.repoType,"]");

                        if (params.shot) {
                            shooter.execute(normal,resolve,reject);
                        } else {
                            sipper.execute(normal,params.initShot,params.endShot,resolve,reject);
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
        logger.trace("#green","sour:check:","params:",params.argv.remain);
        var normal = normalize(params.argv.remain);
        if (isAvailable(normal)){
            return normal;
        }else {
            if (normal.name) {
                if (params.shot)
                    logger.error(messages["shot"], "#green", params.argv.remain, "#red", messages["notExists"]);
                else
                    logger.error(messages["straw"], "#green", params.argv.remain, "#red", messages["notExists"]);
                logger.txt("\n",messages["forhelp"],"\n");
                reject("command not available");
            }else {
                docs.help(params.shot, []);
            }
            return;
        }

    };

    /**
     * Normalize command getting repoType
     *
     * @returns {{name: *, repoType: *, orig: *}}
     */
    var normalize = function(){
        logger.trace("#green","sour:normalize:","params:",params.argv.remain);
        var arg = params.argv.remain;
        if( Object.prototype.toString.call( arg ) === '[object Array]') {
            arg = arg[0];
            if (!arg) arg = "";
        }
        var normal = {};
        normal.orig = normal.name = arg;
        if (arg.indexOf(':')>0){
            var names = arg.split(':');
            normal.repoType = names[0];
            normal.name = names[1];
        }

        if (normal.repoType){
            var exists = config.repoTypes.find(function(unit){
                return unit===normal.repoType;
            });
            if (!exists){
                logger.warn("#yellow","WARNING:","#cyan",normal.repoType,messages["isnotproduct"],",",messages["default"]);
                normal.repoType = undefined;
            }
        };

        //if repoType is undefined
        normal.repoType = !normal.repoType?(!config.repoType?config.defaultType:config.repoType):normal.repoType;

        return normal;
    };

    /**
     * Checks if the command params exists
     */
    var isAvailable = function(normal){
        logger.trace("#green","sour:isAvailable:",normal);
        if (!normal.name)
            return false;
        if (params.shot){
            for (var straw in config.straws){
                for (var shot in config.straws[straw].shots){
                    if (shot === normal.name)
                        return true;
                }
            }
        }else{
            for (var straw in config.straws){
                if (straw === normal.name) {
                    if (config.straws[straw].type!=='util')
                        return true;
                    else{
                        logger.error("#red", straw,messages['type'],"#cyan",config.straws[straw].type,messages['notExecutable']);
                        return false;
                    }
                }
            }
        }
        return false;
    };

    //Piscosour Interface
    return {
        gush: gush
    }
};

module.exports = Sour;