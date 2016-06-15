'use strict';

const logger = require('./logger');
const stepper = require('./stepper');
const moment = require('moment');
const config = require('./config');
const analytics = require('./analytics');

const sipper = function() {

  let steps = [];
  let flow = {};

  const synchro = function(normal, n, resolve, reject) {

    const _resolve = function(outputs) {
      if (outputs) {
        logger.trace('#cyan', 'outputs of', steps[n], '->', outputs);
        flow.steps[steps[n]].outputs = outputs;
      }
      synchro(normal, n + 1, resolve, reject);
    };

    const _reject = function(err) {
      if (err && err.keep) {
        logger.warn('#green', 'sipper', '#yellow', 'Step error don\'t stops the flow!!', (err.error || err));
        synchro(normal, n + 1, resolve, reject);
      } else {
        logger.error('#green', 'sipper', 'Step error stops the flow!!', '#red', 'ERROR:', (err.error || err));
        reject(err);
      }
    };

    const _addOutputs = function(params, inputs) {
      if (inputs) {
        Object.getOwnPropertyNames(inputs).forEach((input) => {
          const pair = inputs[input];
          Object.getOwnPropertyNames(pair).forEach((stepName) => {
            const outputs = flow.steps[stepName].outputs;
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

      const step = flow.steps[steps[n]];

      const normalStep = JSON.parse(JSON.stringify(normal));
      normalStep.name = steps[n];
      normalStep.orig = normal.context + ':' + normalStep.name;

      if (step.type === 'flow') {
        normalStep.order = n + 1;
        sipper().execute(normalStep, step.from, step.to, _resolve, _reject);
      } else {
        normalStep.params = config.getFlowParams(normalStep, normal);
        normalStep.params = _addOutputs(normalStep.params, step.inputs);
        normalStep.order = n + (normal.order ? normal.order : 1);
        analytics.hit(`/flows/${normal.context}:${normal.name}/steps/${normalStep.name}`, `step: ${normal.context}::${normalStep.name}`);
        stepper.execute(normalStep, _resolve, _reject);
      }

    } else {
      logger.info('Flow', '[', '#bold', normal.orig, ']', 'finished -', '#duration', moment() - normal.initFlow);
      resolve();
    }
  };

  /**
   * Filter steps 'from' and 'to' the flow in params
   *
   * @param flow
   * @param fromStep
   * @param toStep
   * @returns {Array}
   */
  const filterSteps = function(flowName, fromStep, toStep) {
    logger.trace('#green', 'sipper:filterSteps', 'flow:', flowName, 'fromStep:', fromStep, 'toStep:', toStep);

    let rsteps = Object.keys(flow.steps);
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
   * Run all the commands contained on a flow from fromStep to toStep
   *
   * @param flow normalized
   * @param fromStep
   * @param toStep
   */
  const execute = function(normal, fromStep, toStep, resolve, reject) {
    logger.trace('#green', 'sipper:execute', 'flow:', normal.orig, 'fromStep:', fromStep, 'toStep:', toStep);
    flow = config.getFlow(normal);
    normal.initFlow = moment();
    steps = filterSteps(normal.name, fromStep, toStep);
    logger.info('Starting flow', '[', '#bold', normal.orig, ']', 'steps:', steps);
    synchro(normal, 0, resolve, reject);
  };

  return {
    execute: execute
  };

};

/**
 * **Internal:**
 *
 * Execute in waterfall all the steps of a flow.
 *
 * @module sipper
 */
module.exports = sipper();
