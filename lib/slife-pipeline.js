/*jshint node:true */

'use strict';

var logger = require('./slife-logger'),
    stepExec = require('./slife-step'),
    i18n = require("./slife-i18n"),
    config = require('./slife-config');

var messages = i18n.messages("/messages.json");

var getPipeline = function() {


    var steps = [];
    /**
     * Run all the commands contained on a pipeline from fromStep to toStep
     *
     * @param pipeline
     * @param fromStep
     * @param toStep
     */
    var execute = function(normal, fromStep, toStep, resolve, reject) {
        logger.trace("#green","slife-pipeline:execute","pipeline:",normal.orig,"fromStep:",fromStep,"toStep:",toStep);
        steps = filterSteps(normal.name, fromStep, toStep);
        logger.info("Executing pipeline","[","#bold",normal.orig,"]","shots:",steps);
        synchro(normal, 0,resolve,reject);
    };

    var synchro = function(normal, n,resolve,reject){
        if (n<steps.length) {
            logger.trace("#green", "slife-pipeline:synchro", messages["trying"], "#cyan", steps[n], "(", n, "of", steps.length, ")");

            var step = config.pipelines[normal.name].steps[steps[n]];

            var onResolve = function () {
                synchro(normal, n + 1, resolve, reject);
            };

            var onReject = function (err) {
                logger.trace("#green", "slife-pipeline:synchro","#red","Step Error Stops the pipeline!!");
                reject(err);
                // si queremos continuar sí o sí usar esto,.. quizá más adelante en un tipo especial de pipeline...
                //synchro(pipeline, n + 1, resolve, reject);
            };

            var normalStep = JSON.parse(JSON.stringify(normal));
            normalStep.name = steps[n];
            normalStep.orig = normal.unitType+":"+normalStep.name;

            if (step.type==="pipeline")
                execute(normalStep,step.from,step.to,onResolve,onReject);
            else
                stepExec.execute(normalStep,onResolve,onReject);

        }else{
            logger.info("#green","slife-pipeline:synchro","#cyan",normal.name,"ended");
            resolve();
        }
    };

    /**
     * Filter shots 'from' and 'to' the step in params
     *
     * @param pipeline
     * @param fromStep
     * @param toStep
     * @returns {Array}
     */
    var filterSteps = function(pipeline, fromStep, toStep){
        logger.trace("#green","slife-pipeline:filterSteps","pipeline:",pipeline,"fromStep:",fromStep,"toStep:",toStep);

        var steps = Object.keys(config.pipelines[pipeline].steps);
        logger.trace("#green","slife-pipeline:filterSteps","shots before:",steps);

        var fromIndex = steps.indexOf(fromStep);
        var toIndex = steps.lastIndexOf(toStep);

        if (fromIndex<0) fromIndex = 0;
        if (toIndex<0) toIndex=steps.length;

        steps = steps.slice(fromIndex,toIndex);
        logger.trace("#green","slife-pipeline:filterSteps","shots after:",steps);
        return steps;
    };

    /**
     * Run all precondition of all the shots of the pipeline
     *
     * @param pipeline
     * @param fromStep
     * @param toStep
     */
    var doctor = function(pipeline, fromStep, toStep){
        logger.info("Doctor pipeline");
    };

    return {
        execute: execute
    }

};

module.exports = getPipeline();