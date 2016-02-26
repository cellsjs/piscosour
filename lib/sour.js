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
 * Sour is the command line interface
 * @returns gush : execute the command.
 * @constructor Object params obtained from command line using nopt module.
 */
var Sour = function(){

    var lastCheck = function(init){
        try{
            return finalCheck.run(init);
        }catch (e){
            logger.error(e);
        }
    };

    /**
     * Execute all the commands of the utility
     * @returns {Promise}
     */
    var gush = function () {

        var promise = new Promise(function(resolve,reject){
            logger.trace("#green","sour:gush","params:",params.argv.remain);
            var init = moment();

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
                    if (params.help) {
                        docs.help(params.shot, params.argv.remain);
                        resolve(); //help is synchronous
                    } else {

                        for (var i in config.warnings){
                            logger.trace(config.warnings[i]);
                        }

                        logger.info("Your repository type is:","[","#bold",normal.repoType,"]");

                        if (params.shot) {
                            normal.params = config.getShotParams(normal);
                            shooter.execute(normal,xresolve,xreject);
                        } else {
                            sipper.execute(normal,params.initShot,params.endShot,xresolve,xreject);
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
                    logger.error("shot", "#green", params.argv.remain, "#red", "doesn't exist!");
                else
                    logger.error("straw", "#green", params.argv.remain, "#red", "doesn't exist!");
                logger.txt("\n",config.cmd,"-h' for help.","\n");
                reject("command not available");
            } else {
                docs.help(params.shot, []);
            }

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
                logger.warn("#yellow","WARNING:","#cyan",normal.repoType,"is not a software unit in the configuration",",","using default!");
                normal.repoType = undefined;
            }
        }
        //if repoType is undefined
        normal.repoType = !normal.repoType?(!config.repoType?config.defaultType:config.repoType):normal.repoType;

        params.normal = normal;

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
            for (var shot in config.shots){
                if (shot === normal.name)
                    return true;
            }
        }else{
            for (var straw in config.straws){
                if (straw === normal.name) {
                    return true;
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