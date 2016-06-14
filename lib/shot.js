'use strict';

const moment = require('moment');

const config = require('./config');
const logger = require('./logger');
const Waterfall = require('./utils/waterfall');

/**
 *
 * A shot is a **Step** in a execution. **Straws** are considered as a pipeline.
 *
 * @param runner this is the configuration object inside a shot.
 * @returns {Shot}
 * @constructor Shot
 */
const Shot = function(step, plugins) {
  this.logger = logger;
  this.plugins = plugins || {};

  this._augment(step);
  Object.getOwnPropertyNames(this.plugins).forEach((plugin) => {
    Object.getOwnPropertyNames(this.plugins[plugin].addons || {}).forEach((addon) => {
      if (config.stages.indexOf(addon) >= 0) {
        delete this.plugins[plugin].addons[addon];
      }
    });
    this._augment(this.plugins[plugin].addons);
  });

  return this;
};

/**
 * Use to add functions to the object instance.
 * @param which. function to be added
 * @param namespace. namespace to add the function.
 * @private
 */
Shot.prototype._augment = function(which, namespace) {
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
 * Main function of a shot. Execute the stage of the shot, if this stage is implemented
 * @param stage
 * @returns {Promise}
 * @private
 */
Shot.prototype._do = function(stage) {
  this.init = moment();
  const operation = this[stage];
  if (operation) {
    logger.info('#magenta', stage, 'stage running...');
    return new Promise((resolve, reject) => {
      this.outputs = undefined;
      if (stage === 'emit') {
        this.outputs = operation();
        resolve();
      } else if (!operation(resolve, reject)) {
        logger.trace('auto-resolve is called!');
        resolve();
      }
    });
  } else {
    return;
  }
};

/**
 * Execute all the plugins hooks configured for the Shot.
 * @param stage
 * @private
 */
Shot.prototype._doPlugins = function(stage) {
  logger.silly('doPlugins -in-', stage);
  const promises = [];
  if (this.plugins) {
    Object.getOwnPropertyNames(this.plugins).forEach((name) => {
      const plugin = this.plugins[name];
      const operation = plugin[stage];

      if (operation) {
        logger.trace('Executing plugin', name, 'pre-hook:', stage);
        promises.push({
          fn: operation.bind(this),
          args: [],
          obj: null
        });
      }
    });
  }
  const waterfall = new Waterfall({
    promises: promises,
    logger: logger
  });
  logger.silly('doPlugins -out-', promises.length);
  return waterfall.start();
};

/**
 * Write reporting information of the shot.
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
Shot.prototype.report = function(result) {
  if (!global[this.name]) {
    global[this.name] = {};
  }

  let report = global[this.name].xxreport;
  if (!report) {
    report = {
      name: this.name,
      description: this.params.description,
      results: [],
      timestamp: new Date(),
      time: moment()
    };
  }

  if (result && result.last) {
    report.time = moment() - report.time;
  }

  report.results.push(result);
  global[this.name].xxreport = report;
};

/**
 * Save any object in the global context and is posible to use by any other shot in the straw.
 * Example in any shot:
 *
 * ```js
 * [...]
 * this.save('key',{param: 1}, true);
 * [...]
 * ```
 *
 * @param key - used to store the object in the global context.
 * @param obj - obj to be store
 * @param isGlobal - If is set name of shot is not necesary to retrive it.
 */
Shot.prototype.save = function(key, obj, isGlobal) {
  logger.warn('#yellow', 'WARNING: "this.save" method is going to be deprecated in the next piscosour release (now is 5.0.1), use emit instead!!');
  const context = isGlobal ? 'piscosour' : this.name;
  if (!global[context]) {
    global[context] = {};
  }

  global[context][key] = obj;
};

/**
 * Get any other param store in global context using save
 * Example:
 *
 * ```js
 *  const other = this.get('key');
 * ```
 *
 * @param key - used to store the object
 * @param shotName - name of the shot that store the object or undefined of isGlobal was true.
 * @returns {*} - the value or undefined if is not found.
 */
Shot.prototype.get = function(key, shotName) {
  logger.warn('#yellow', 'WARNING: "this.get" method is going to be deprecated in the next piscosour release (now is 5.0.1), use emit instead!!');
  if (!shotName) {
    shotName = 'piscosour';
  }
  if (global[shotName]) {
    return global[shotName][key];
  }
};

module.exports = Shot;
