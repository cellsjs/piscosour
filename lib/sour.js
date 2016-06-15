'use strict';

const docs = require('./docs');
const path = require('path');
const moment = require('moment');
const config = require('./config');
const stepper = require('./stepper');
const params = require('./params');
const finalCheck = require('./finalCheck');
const sipper = require('./sipper');
const logger = require('./logger');
const analytics = require('./analytics');

/**
 * Sour is the commands line interface
 * @returns gush : execute the commands.
 * @constructor Sour
 */
module.exports = function() {

  const lastCheck = function(init) {
    try {
      return finalCheck.run(init);
    } catch (e) {
      logger.error(e.stack);
    }
  };

  /**
   * Normalize commands getting context
   *
   * @returns {{name: *, context: *, orig: *, recipe: *, isStep: *}}
   * @private
   */
  const normalize = function(command) {
    logger.trace('#green', 'sour:normalize:', 'commands:', command);

    if (Object.prototype.toString.call(command) === '[object Array]') {
      command = command[0];
      if (!command) {
        command = '';
      }
    }

    const normal = {};

    normal.orig = normal.name = command;

    if (command.indexOf(':') > 0) {
      const names = command.split(':');
      normal.context = names[0];
      if (names.length === 3) {
        normal.isStep = true;
        normal.name = names[2];
      } else {
        normal.name = names[1];
      }
    }

    if (normal.context) {
      const exists = Object.getOwnPropertyNames(config.contexts).find(name => name === normal.context);

      if (!exists) {
        logger.warn('#yellow', 'WARNING:', '#cyan', normal.context, 'is not a software unit in the configuration', ',', 'using default!');
        normal.context = undefined;
      }
    }

    //if context is undefined
    normal.context = !normal.context ? (!config.context ? config.defaultContext : config.context) : normal.context;

    params.normal = normal;

    return normal;
  };

  const defaultCmd = function(normal, cb) {
    if (config.defaultFlow && !params.help) {
      normal.name = config.defaultFlow;
      normal.orig = config.defaultContext;
      return normal;
    } else {
      docs.help(normal, cb);
    }
  };

  /**
   * checks if the params is available and compatible with configurations
   * @param reject : callback function
   * @private
   */
  const check = function(reject, cb) {
    logger.trace('#green', 'sour:check:', 'commands:', params.commands);
    const normal = normalize(params.commands);
    if (config.isAvailable(normal)) {
      return normal;
    } else {
      if (normal.name) {
        if (normal.isStep) {
          logger.error('step', '#green', normal.orig, '#red', 'doesn\'t exist!');
        } else {
          logger.error('flow', '#green', normal.orig, '#red', 'doesn\'t exist!');
        }
        logger.txt('\n', config.cmd, '-la for help.', '\n');
        reject('command not available');
      } else {
        return defaultCmd(normal, cb);
      }
    }

  };

  /**
   * Execute all the commands of the utility
   * @returns {Promise}
   */
  const gush = function(init) {
    return new Promise((resolve, reject) => {
      logger.trace('#green', 'sour:gush', 'commands:', params.commands);

      const _resolve = function() {
        const isOk = lastCheck(init);
        if (isOk) {
          resolve.apply(this, arguments);
        } else {
          reject.apply(this, arguments);
        }
      };

      const _reject = function() {
        lastCheck(init);
        reject.apply(this, arguments);
      };

      const execute = function(normal) {
        logger.info('Your repository type is:', '[', '#bold', normal.context, ']');

        if (normal.isStep) {
          normal.params = config.getStepParams(normal);
          analytics.hit(`/steps/${normal.context}::${normal.name}`, `step: ${normal.context}::${normal.name}`);
          stepper.execute(normal, _resolve, _reject);
        } else {
          analytics.hit(`/flows/${normal.context}:${normal.name}`, `flow: ${normal.context}:${normal.name}`);
          sipper.execute(normal, params.initStep, params.endStep, _resolve, _reject);
        }
      };

      const executeAnswers = function(answers) {
        execute(normalize([ answers.command && !answers.step ? answers.command : answers.step ]));
      };

      try {
        if (params.version) {
          docs.version();
        } else {
          const normal = check(reject, executeAnswers);
          if (normal) {
            normal.init = init;
            if (params.help) {
              docs.help(normal);
            } else {
              execute(normal);
            }
          }
        }
      } catch (e) {
        console.error(e.stack);
        reject(e);
      }
    });
  };

  return {
    gush: gush
  };
};
