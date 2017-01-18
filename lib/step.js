'use strict';

const _ = require('lodash');
const moment = require('moment');

const bus = require('./bus');
const config = require('./config');
const logger = require('./logger');
const reporter = require('./reporter');
const Waterfall = require('./utils/waterfall');

/**
 *
 * A step is a **Step** in a execution. **Flows** are considered as a pipeline.
 *
 * @param runner this is the configuration object inside a step.
 * @returns {Step}
 * @constructor Step
 */
const Step = function(step, plugins) {
  this.logger = logger;
  this.plugins = plugins || {};

  this._augment(step);
  Object.getOwnPropertyNames(this.plugins).forEach((plugin) => {
    if (this.plugins[plugin] && this.plugins[plugin].addons) {
      Object.getOwnPropertyNames(this.plugins[plugin].addons || {}).forEach((addon) => {
        if (config.get().stages.indexOf(addon) >= 0) {
          delete this.plugins[plugin].addons[addon];
        }
      });
      this._augment(this.plugins[plugin].addons);
    }
  });
  return this;
};

/**
 * Use to add functions to the object instance.
 * @param which. function to be added
 * @param namespace. namespace to add the function.
 * @private
 */
Step.prototype._augment = function(which, namespace) {
  const target = namespace ? this[namespace] : this;

  for (const name in which) {
    if (typeof which[name] === 'function') {
      target[name] = which[name].bind(this);
    } else {
      target[name] = which[name];
    }
  }
};

/**
 * Main function of a step. Execute the stage of the step, if this stage is implemented
 * @param stage
 * @returns {Promise}
 * @private
 */
Step.prototype._do = function(stage) {
  this.init = moment();
  const operation = this[stage];
  if (operation) {
    logger.info('#magenta', stage, 'stage running...');
    bus.emit('stage:start', { name: stage });
    return new Promise((resolve, reject) => {
      this.outputs = undefined;
      if (stage === 'emit') {
        this.outputs = operation();
        resolve();
      } else if (!operation(resolve, reject)) {
        logger.trace('auto-resolve is called!');
        resolve();
      }
    }).catch((err) => {
      const onError = this.onError;
      if (onError) {
        onError(stage, err);
      }
      throw err;
    });
  } else {
    return;
  }
};

/**
 * Execute all the plugins hooks configured for the Step.
 * @param stage
 * @private
 */
Step.prototype._doPlugins = function(stage) {
  logger.silly('doPlugins -in-', stage);
  const promises = [];
  if (this.plugins) {
    Object.getOwnPropertyNames(this.plugins).forEach((name) => {
      const plugin = this.plugins[name];
      if (plugin) {
        const operation = plugin[stage];

        if (operation) {
          logger.trace('Executing plugin', name, 'pre-hook:', stage);
          promises.push({
            fn: operation.bind(this),
            args: [],
            obj: null
          });
        }
      }
    });
  }
  if (promises.length > 0) {
    bus.emit('stage:start', { name: stage });
  }
  const waterfall = new Waterfall({
    promises: promises,
    logger: logger
  });
  logger.silly('doPlugins -out-', promises.length);
  return waterfall.start();
};

/**
 * Write reporting information of the step.
 *
 * example:
 * result has this aspect:
 * ```
 * const result = {
 *               status: 1|0,
 *               message: 'some text',
 *               content: 'some text',
 *               time: time in milliseconds,
 *               order: number,
 *               last: last
 *           };
 * this.report(result);
 * ```
 * @param result The object above
 * @function
 */
Step.prototype.report = function(result) {
  if (!result.content.skipped) {
    bus.emit('stage:end', result);
  }
};

module.exports = Step;
