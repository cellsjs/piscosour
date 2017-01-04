'use strict';

const _ = require('lodash');
const moment = require('moment');

const analytics = require('./analytics');
const config = require('./config');
const finalCheck = require('./finalCheck');
const logger = require('./logger');
const stepper = require('./stepper');


const sipper = function() {

  let steps = [];
  let flow = {};

  const synchro = function(normalFlow, n, resolve, reject) {

    const _reject = function(err) {
      if (err && err.keep) {
        synchro(normalFlow, n + 1, resolve, reject);
      } else {
        reject(err);
      }
    };

    const _resolve = function(outputs) {
      if (outputs) {
        logger.trace('Step', '[', '#bold', steps[n], ']', `outputs:\n${JSON.stringify(outputs, null, 2)}`);
        _.map(outputs, (output, context) => _.set(flow, `steps[${steps[n]}].outputs[${context}]`, output));
      }

      const step = flow.steps[steps[n]];
      let exec = true;
      if (step.type === 'flow') {
        if (!finalCheck.run(normalFlow.init).softOk()) {
          exec = false;
          _reject({error: `${steps[n]} has an error!!`});
        }
      }

      if (exec) {
        synchro(normalFlow, n + 1, resolve, reject);
      }
    };

    const _addOutputs = function(params, inputs) {
      const _setInput = (inputVar, outputVar) => (output, context) => params[context][inputVar] = output[outputVar];
      const _getOutput = inputVar => (outputVar, stepName) => _.map(flow.steps[stepName].outputs, _setInput(inputVar, outputVar));
      const _mapOutputs = (mapping, inputVar) => _.map(mapping, _getOutput(inputVar));

      _.map(inputs, _mapOutputs);

      return params;
    };

    if (n < steps.length) {
      logger.trace('#green', 'sipper', 'trying', '#cyan', steps[n], '(', n, 'of', steps.length, ')');

      const step = flow.steps[steps[n]];
      const normalStep = _.cloneDeep(normalFlow);

      normalStep.name = steps[n];
      normalStep.orig = normalFlow.context + ':' + normalStep.name;

      if (step.type === 'flow') {
        normalStep.order = n + 1;
        sipper().execute(normalStep, step.from, step.to, _resolve, _reject);
      } else {
        normalStep.params = config.getFlowParams(normalStep, normalFlow);
        normalStep.params = _addOutputs(normalStep.params, step.inputs);
        normalStep.order = n + (normalFlow.order ? normalFlow.order : 1);
        analytics.hit(`/flows/${normalStep.context}:${normalFlow.name}/steps/${normalStep.name}`, `step: ${normalStep.context}::${normalStep.name}`);

        stepper.execute(normalStep, _resolve, _reject);
      }
    } else {
      logger.info('Flow', '[', '#bold', normalFlow.name, ']', 'finished -', '#duration', moment() - normalFlow.initFlow);
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

    let rsteps = flow && flow.steps ? Object.keys(flow.steps) : [];
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
    if (flow) {
      flow.params = flow.params || {};
    }

    normal.initFlow = moment();
    steps = filterSteps(normal.name, fromStep, toStep);
    logger.info('Starting flow: [', '#bold', normal.name, '], steps: [', '#bold', steps.join(', '), ']');
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
