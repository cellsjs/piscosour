/*jshint node:true */

'use strict';

var config = require("./config"),
    logger = require("./logger"),
    i18n = require("./i18n");

var messages = i18n.messages("/messages.json");

var shooter = function(){

    var shot = {};

    /**
     * Execute one shot with conditions checks
     *
     * @param normal shot name
     */
    var execute = function(normal,resolve,reject) {
        logger.trace("#green","shooter:execute","piscosour task","#cyan",normal.orig," ----------- [","#yellow",messages["start"],"]----------");
        logger.info(messages["task"],"[","#bold",normal.orig,"] ----------- [","#yellow",messages["start"],"]----------");

        shot = load(normal);
        synchro(0,resolve,reject);
    };

    /**
     * Execute shot by shot recursively and synchronized!
     * @param n
     * @param resolve
     * @param reject
     */
    var synchro = function(n, resolve, reject){
        if (n<config.stages.length) {
            logger.trace("#green", "shooter:synchro", messages["trying"], "#cyan", config.stages[n], "(", n, "of", config.stages.length, ")");

            var onResolve = function () {
                synchro(n + 1, resolve, reject);
            };

            var onReject = function (err) {
                logger.trace("#red", "shooter:synchro", messages["stops"], "#cyan", config.stages[n], "(", n, "of", config.stages.length, ")", err);
                reject(err);
                // si queremos que siga igualmente se ejecutaría esto
                //synchro(n + 1, resolve, reject);
            };

            var promise = shot.do(config.stages[n]);
            if (promise)
                promise.then(onResolve, onReject);

        }else resolve();
    };

    var load = function(normal){
        var errors = [];
        var shot = {};
        for (var name in config.modulesDir){
            var fileName = config.modulesDir[name]+"/shots/"+normal.name+"/"+normal.repoType+"/shot.js";
            logger.trace("#green","shooter:load","trying",fileName,"...");
            try{
                //TODO: Probar que esto funciona correctamente con un Objeto de tipo Shot y con Arrays
                var n = require(fileName);
                logger.info("n-->",n, typeof n);
                shot = config.merge(shot,n);
                logger.info("shot-->",shot, typeof shot);

            }catch(e){
                if (e.code==='MODULE_NOT_FOUND')
                    logger.trace("#red","shooter:load","#yellow",fileName, messages["notExists"]);
                else
                    logger.trace("#red","shooter:load","#yellow",fileName,e);
            }
        }
        return shot;
    };

    return {
        execute : execute
    }
};

module.exports = shooter();