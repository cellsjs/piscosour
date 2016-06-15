'use strict';

const logger = require('./logger');
const stepper = require('./stepper');
const moment = require('moment');
const config = require('./config');
const analytics = require('./analytics');

const sipper = function() {

  let steps = [];
  let straw = {};

  const synchro = function(normal, n, resolve, reject) {

    const _resolve = function(outputs) {
      if (outputs) {
        logger.trace('#cyan', 'outputs of', steps[n], '->', outputs);
        straw.steps[steps[n]].outputs = outputs;
      }
      synchro(normal, n + 1, resolve, reject);
    };

    const _reject = function(err) {
      if (err && err.keep) {
        logger.warn('#green', 'sipper', '#yellow', 'Step error don\'t stops the straw!!', (err.error || err));
        synchro(normal, n + 1, resolve, reject);
      } else {
        logger.error('#green', 'sipper', 'Step error stops the straw!!', '#red', 'ERROR:', (err.error || err));
        reject(err);
      }
    };

    const _addOutputs = function(params, inputs) {
      if (inputs) {
        Object.getOwnPropertyNames(inputs).forEach((input) => {
          const pair = inputs[input];
          Object.getOwnPropertyNames(pair).forEach((stepName) => {
            const outputs = straw.steps[stepName].outputs;
            if (outputs) {
              params[input] = outputs[pair[stepName]];
            }
          });
        });
      }
      return params;
    };

    if (n < steps.length) {
      logger.trace('#green', 'sipper', 'trying', '#cyan', steps[n], '(', n, 'of', steps.length, ')');

      const step = straw.steps[steps[n]];

      const normalStep = JSON.parse(JSON.stringify(normal));
      normalStep.name = steps[n];
      normalStep.orig = normal.context + ':' + normalStep.name;

      if (step.type === 'straw') {
        normalStep.order = n + 1;
        sipper().execute(normalStep, step.from, step.to, _resolve, _reject);
      } else {
        normalStep.params = config.getStrawParams(normalStep, normal);
        normalStep.params = _addOutputs(normalStep.params, step.inputs);
        normalStep.order = n + (normal.order ? normal.order : 1);
        analytics.hit(`/straws/${normal.context}:${normal.name}/steps/${normalStep.name}`, `step: ${normal.context}::${normalStep.name}`);
        stepper.execute(normalStep, _resolve, _reject);
      }

    } else {
      logger.info('Straw', '[', '#bold', normal.orig, ']', 'sipped -', '#duration', moment() - normal.initStraw);
      resolve();
    }
  };

  /**
   * Filter steps 'from' and 'to' the straw in params
   *
   * @param straw
   * @param fromStep
   * @param toStep
   * @returns {Array}
   */
  const filterSteps = function(strawName, fromStep, toStep) {
    logger.trace('#green', 'sipper:filterSteps', 'straw:', strawName, 'fromStep:', fromStep, 'toStep:', toStep);

    let rsteps = Object.keys(straw.steps);
    logger.trace('#green', 'sipper:filterSteps', 'steps before:', rsteps);

    let fromIndex = rsteps.indexOf(fromStep);
    let toIndex = rsteps.lastIndexOf(toStep);

    if (fromIndex < 0) {
      fromIndex = 0;
    }
    if (toIndex < 0) {
      toIndex = rsteps.length;
    } else {
      toIndex = toIndex + 1;
    }

    rsteps = rsteps.slice(fromIndex, toIndex);
    logger.trace('#green', 'sipper:filterSteps', 'steps after:', rsteps);
    return rsteps;
  };

  /**
   * Run all the commands contained on a straw from fromStep to toStep
   *
   * @param straw normalized
   * @param fromStep
   * @param toStep
   */
  const execute = function(normal, fromStep, toStep, resolve, reject) {
    logger.trace('#green', 'sipper:execute', 'straw:', normal.orig, 'fromStep:', fromStep, 'toStep:', toStep);
    straw = config.getStraw(normal);
    normal.initStraw = moment();
    steps = filterSteps(normal.name, fromStep, toStep);
    logger.info('Sipping straw', '[', '#bold', normal.orig, ']', 'steps:', steps);
    synchro(normal, 0, resolve, reject);
  };

  return {
    execute: execute
  };

};

/**
 * **Internal:**
 *
 * Execute in waterfall all the steps of a straw.
 *
 * @module sipper
 */
module.exports = sipper();