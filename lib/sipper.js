/*jshint node:true */

'use strict';

var logger = require('./logger'),
    shotExec = require('./shooter'),
    i18n = require("./i18n"),
    config = require('./config');

var messages = i18n.messages("/messages.json");

var sipper = function() {


    var shots = [];
    /**
     * Run all the commands contained on a straw from fromShot to toShot
     *
     * @param straw normalized
     * @param fromShot
     * @param toShot
     */
    var execute = function(normal, fromShot, toShot, resolve, reject) {
        logger.trace("#green","sipper:execute","straw:",normal.orig,"fromShot:",fromShot,"toShot:",toShot);
        shots = filterShots(normal.name, fromShot, toShot);
        logger.info("Sipping straw","[","#bold",normal.orig,"]","shots:",shots);
        synchro(normal, 0,resolve,reject);
    };

    var synchro = function(normal, n,resolve,reject){
        if (n<shots.length) {
            logger.trace("#green", "sipper:synchro", messages["trying"], "#cyan", shots[n], "(", n, "of", shots.length, ")");

            var shot = config.straws[normal.name].shots[shots[n]];

            var onResolve = function () {
                synchro(normal, n + 1, resolve, reject);
            };

            var onReject = function (err) {
                logger.error("#green", "sipper:synchro","#red","Shot Error Stops the straw!!",err);
                reject(err);
                // si queremos continuar sí o sí usar esto,.. quizá más adelante en un tipo especial de straw...
                //synchro(straw, n + 1, resolve, reject);
            };

            var normalShot = JSON.parse(JSON.stringify(normal));
            normalShot.name = shots[n];
            normalShot.orig = normal.repoType+":"+normalShot.name;

            if (shot.type==="straw")
                sipper().execute(normalShot,shot.from,shot.to,onResolve,onReject);
            else
                shotExec.execute(normalShot,onResolve,onReject);

        }else{
            logger.info("Straw","[","#bold",normal.orig,"]","sipped");
            resolve();
        }
    };

    /**
     * Filter shots 'from' and 'to' the straw in params
     *
     * @param straw
     * @param fromShot
     * @param toShot
     * @returns {Array}
     */
    var filterShots = function(straw, fromShot, toShot){
        logger.trace("#green","sipper:filterShots","straw:",straw,"fromShot:",fromShot,"toShot:",toShot);

        var shots = Object.keys(config.straws[straw].shots);
        logger.trace("#green","sipper:filterShots","shots before:",shots);

        var fromIndex = shots.indexOf(fromShot);
        var toIndex = shots.lastIndexOf(toShot);

        if (fromIndex<0) fromIndex = 0;
        if (toIndex<0) toIndex=shots.length;
        else toIndex = toIndex + 1;

        shots = shots.slice(fromIndex,toIndex);
        logger.trace("#green","sipper:filterShots","shots after:",shots);
        return shots;
    };

    /**
     * Run all precondition of all the shots of the straw
     *
     * @param straw
     * @param fromShot
     * @param toShot
     */
    var doctor = function(straw, fromShot, toShot){
        logger.info("Doctor straw");
    };

    return {
        execute: execute
    }

};

module.exports = sipper();