/*jshint node:true */

'use strict';

var logger = require('./logger'),
    shooter = require('./shooter'),
    moment = require('moment'),
    config = require('./config');

var sipper = function() {


    var shots = [];
    var straw = {};
    /**
     * Run all the commands contained on a straw from fromShot to toShot
     *
     * @param straw normalized
     * @param fromShot
     * @param toShot
     */
    var execute = function(normal, fromShot, toShot, resolve, reject) {
        logger.trace("#green","sipper:execute","straw:",normal.orig,"fromShot:",fromShot,"toShot:",toShot);
        straw = config.getStraw(normal);
        normal.initStraw = moment();
        shots = filterShots(normal.name, fromShot, toShot);
        logger.info("Sipping straw","[","#bold",normal.orig,"]","shots:",shots);
        synchro(normal, 0,resolve,reject);
    };

    var synchro = function(normal, n,resolve,reject){

        var onResolve = function () {
            synchro(normal, n + 1, resolve, reject);
        };

        var onReject = function (err) {
            if (err && err.keep) {
                logger.warn("#green", "sipper","#yellow","Shot error don't stops the straw!!", (err.error || err));
                synchro(normal, n + 1, resolve, reject);
            } else {
                logger.error("#green", "sipper","Shot error stops the straw!!","#red","ERROR:",(err.error || err));
                reject(err);
            }
        };

        if (n<shots.length) {
            logger.trace("#green", "sipper", "trying", "#cyan", shots[n], "(", n, "of", shots.length, ")");

            var shot = straw.shots[shots[n]];

            var normalShot = JSON.parse(JSON.stringify(normal));
            normalShot.name = shots[n];
            normalShot.orig = normal.repoType+":"+normalShot.name;

            if (shot.type==="straw") {
                normalShot.order = n+1;
                sipper().execute(normalShot, shot.from, shot.to, onResolve, onReject);
            }else {
                normalShot.params = config.getStrawParams(normalShot, normal);
                normalShot.order = n+(normal.order?normal.order:1);
                shooter.execute(normalShot, onResolve, onReject);
            }

        }else{
            logger.info("Straw","[","#bold",normal.orig,"]","sipped -","#duration",moment()-normal.initStraw);
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
    var filterShots = function(strawName, fromShot, toShot){
        logger.trace("#green","sipper:filterShots","straw:",strawName,"fromShot:",fromShot,"toShot:",toShot);

        var shots = Object.keys(straw.shots);
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

/**
 * **Internal:**
 *
 * Execute in waterfall all the shots of a straw.
 *
 * @module sipper
 */
module.exports = sipper();
