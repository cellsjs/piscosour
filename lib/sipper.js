'use strict';

const _ = require('lodash');
const moment = require('moment');

const analytics = require('./analytics');
const bus = require('./bus');
const config = require('./config');
const execution = require('./execution');
const logger = require('./logger');
const stepper = require('./stepper');
const context = require('./context');


const sipper = function() {

  let steps = [];
  let flow = {};

  const synchro = function(normalFlow, n, resolve, reject) {

    const _reject = function(err) {
      if (err && err.keep) {
        logger.warn('#green', 'sipper', 'Flow error (execution continues)', '#yellow', 'ERROR', (err.error || err));
        synchro(normalFlow, n + 1, resolve, reject);
      } else {
        if (!err.notBuilt) {
          logger.error('#green', 'sipper', 'Flow error (execution stopped)', '#red', 'ERROR', (err.error || err));
        }
        reject(err);
      }
    };

    const _resolve = function(outputs) {
      if (outputs) {
        logger.trace('Step', '[', '#bold', steps[n], ']', `outputs:\n${JSON.stringify(outputs, null, 2)}`);
        _.map(outputs, (output, _context) => _.set(flow, `steps[${steps[n]}].outputs[${_context}]`, output));
      }

      const step = flow.steps[steps[n]];
      let exec = true;
      if (step.type === 'flow') {
        const lastFlow = execution.lastFinished('flow');
        if (!lastFlow.stats.hardOk()) {
          exec = false;
          const message = `Flow "${steps[n]}" ended with an error`;
          bus.emit('flow:end', {
            status: 1,
            data: { error: message }
          });
          _reject({error: message});
        }
      }

      if (exec) {
        synchro(normalFlow, n + 1, resolve, reject);
      }
    };

    const filterContexts = function(step, normal) {
      normal.context = normal.context.filter((_context) => {
        if (flow.excludes) {
          step.excludes = flow.excludes;
        }
        const is = !step.excludes || step.excludes.indexOf(_context) < 0;
        if (!is) {
          logger.info('Run of', '#bold',  step.type ? step.type : 'step', '#green', `"${normal.name}"`, 'is excluded for context', '#cyan', `"${_context}"`);
        }
        return is;
      });
      normal.checkImpl = normal.checkImpl === false ? false : (step['implementation-check'] === undefined || step['implementation-check'] === true);
      return normal;
    };

    const _addOutputs = (params, mappings) => {

      const backCompatibility = (_params) => {
        if (mappings) {
          logger.warn('#cyan', 'Inputs in flows are deprecated: use emit with final name instead', '#yellow', 'WARNING!!');

          const getParams = (paramIn, paramOut, outputs) => {
            const outParams = _.cloneDeep(outputs);
            _.mapKeys(outputs, (contextMap, _context) => {
              _.mapKeys(contextMap, (paramValue, key) => {
                if (paramOut === key) {
                  outParams[_context][paramIn] = paramValue;
                }
                if (paramOut !== key || paramIn !== paramOut) {
                  delete outParams[_context][key];
                }
              });
            });
            return outParams;
          };

          _.mapKeys(mappings, (stepMap, paramIn) => {
            _.mapKeys(stepMap, (paramOut, stepName) => {
              _.merge(_params, getParams(paramIn, paramOut, _.get(flow, `steps[${stepName}].outputs`, {})));
            });
          });
        }
        return _params;
      };

      const myParams = _.cloneDeep(params);
      const outParams =  _.chain(flow.steps)
        .map((step, stepName) => step.outputs)
        .map((paramTmp) => _.merge(myParams, paramTmp))
        .pop().value();

      return backCompatibility(outParams);
    };

    const _reloadContext = (normal) => {
      if (!normal.contextFixed) {
        normal.context = context.whoami(true);
        normal.context = normal.context.length > 0 ? normal.context : undefined;
      }
      return normal;
    };

    if (n < steps.length) {
      logger.trace('#green', 'sipper', 'trying', '#cyan', steps[n], '(', n, 'of', steps.length, ')');

      const step = flow.steps[steps[n]];
      if (step.reloadContext) {
        normalFlow = _reloadContext(normalFlow);
      }
      let normalStep = _.cloneDeep(normalFlow);

      normalStep.name = steps[n];
      normalStep = filterContexts(step, normalStep);
      normalStep.type = step.type;
      normalStep.orig = normalFlow.context + ':' + normalStep.name;
      normalStep.params = config.getFlowParams(normalStep, normalFlow);
      normalStep.params = _addOutputs(normalStep.params, step.inputs);

      if (step.type === 'flow') {
        normalStep.order = n + 1;
        normalStep.flowName = normalStep.name;
        sipper().execute(normalStep, step.from, step.to, _resolve, _reject);
      } else {
        normalStep.order = n + (normalFlow.order ? normalFlow.order : 1);
        analytics.hit(`/flows/${normalStep.context.join('-')}:${normalFlow.name}/steps/${normalStep.name}`, `step: ${normalStep.context.join('-')}::${normalStep.name}`);
        stepper.execute(normalStep, _resolve, _reject);
      }
    } else {
      logger.info('Flow', '[', '#bold', normalFlow.name, ']', 'finished -', '#duration', moment() - normalFlow.initFlow);
      bus.emit('flow:end', { status: 0 });
      const outputs = flow && flow.steps ? _.chain(flow.steps).map((step, stepName) => step.outputs).pop().value() : null;
      resolve(outputs);
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
    bus.emit('flow:start', normal);
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
