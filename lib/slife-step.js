/*jshint node:true */

'use strict';

var gulp = require('gulp'),
    config = require("./slife-config"),
    logger = require("./slife-logger"),
    i18n = require("./slife-i18n"),
    runSequence = require('run-sequence').use(gulp);

var messages = i18n.messages("/messages.json");

gulp.onAll(function (event) {
    logger.event(event);
});

var getStep = function(){

    var errors = [];
    var steps = [];
    /**
     * Execute one step with conditions checks
     *
     * @param step
     */
    var execute = function(normal,resolve,reject) {
        logger.trace("#green","slife-step:execute","shortlife task","#cyan",normal.orig," ----------- [","#yellow",messages["start"],"]----------");
        logger.info("Shortlife task","[","#bold",normal.orig,"] ----------- [","#yellow",messages["start"],"]----------");

        //Inicialize all
        errors = [];
        steps = [];

        load(normal);
        prepare(normal);
        synchro(0,resolve,reject);
    };

    /**
     * Execute step by step recursively and synchronized!
     * @param n
     * @param resolve
     * @param reject
     */
    var synchro = function(n, resolve, reject){
        if (n<steps.length) {
            logger.trace("#green", "slife-step:synchro", messages["trying"], "#cyan", steps[n], "(", n, "of", steps.length, ")");

            var onResolve = function () {
                synchro(n + 1, resolve, reject);
            };

            var onReject = function (err) {
                logger.trace("#yellow", "slife-step:synchro","(", n, "of", steps.length, ") task [","#cyan", steps[n],"]", messages["notExists"]);
                errors.push(err);
                synchro(n + 1, resolve, reject);
            };

            run(steps[n]).then(onResolve, onReject);

        }else{
            logger.trace("#green","slife-step:synchro","n-errors:","#cyan",errors.length,"n-steps:","#cyan",steps.length);
            if (errors.length<steps.length)
                resolve();
            else {
                logger.error("#green","slife-step:synchro","n-errors:","#cyan",errors.length,"n-steps:","#cyan",steps.length,"#red","errors",errors);
                reject(errors);
            }
        }
    };

    /**
     * writes the steps array in order to execute all the stages defined in configurations files
     * @param name
     */
    var prepare = function(normal){
        logger.trace("#green","slife-step:prepare","step","#cyan",normal.orig);

        //configure all the stages sequence
        for (var i in config.stages){
            var stage = config.stages[i];
            steps.push(normal.unitType+":"+normal.name+":"+stage);
            steps.push(normal.name+":"+stage);
        }
        steps.push(normal.name);
        logger.trace("#green","slife-step:prepare","tasks to run","#cyan",steps);
        return steps;
    };

    var load = function(normal){
        for (var name in config.modulesDir){
            var fileName = config.modulesDir[name]+"/steps/"+normal.name+"/task.js";
            logger.trace("#green","slife-step:load","trying",fileName,"...");
            try{
                var gulpImported = require(fileName);
                if (gulpImported){
                    for (var task in gulpImported.tasks){
                        gulp.tasks[task] = gulpImported.tasks[task];
                    }
                }
            }catch(e){
                if (e.code==='MODULE_NOT_FOUND')
                    logger.trace("#red","slife-step:load","#yellow",fileName, messages["notExists"]);
                else
                    logger.trace("#red","slife-step:load","#yellow",fileName,e);
            }
        }
    };

    /**
     * Execute one gulp task
     * @param step is the gulp task
     */
    var run = function(step){
        logger.trace("#green","slife-step:run","Starting: '","#cyan",step,"'...");
        var init = new Date().getTime();

        return new Promise(function(resolve, reject) {

            runSequence(step, function (err) {
                var end = new Date().getTime();
                if (err) {
                    logger.trace("#green","slife-step:run","Finished '", "#cyan", step, "' after ", "#magenta", end - init,"ms", "#red", "Error:", err);
                    reject(err);
                } else {
                    logger.trace("#green","slife-step:run","Finished '", "#cyan", step, "' after ", "#magenta", end - init,"ms");
                    resolve();

                }
            });
        });
    };

    return {
        execute : execute
    }
};

module.exports = getStep();