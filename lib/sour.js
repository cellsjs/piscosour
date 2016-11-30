'use strict';

const docs = require('./docs');
const path = require('path');
const moment = require('moment');
const config = require('./config');
const scullion = require('./globalScullion');
const stepper = require('./stepper');
const params = require('./params');
const context = require('./context');
const finalCheck = require('./finalCheck');
const sipper = require('./sipper');
const logger = require('./logger');
const analytics = require('./analytics');
const spawn = require('child_process').spawn;

/**
 * Sour is the commands line interface
 * @returns gush : execute the commands.
 * @constructor Sour
 */
module.exports = function() {

  const _config = config.get();

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

    if (command.indexOf(':') >= 0) {
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
      const exists = Object.getOwnPropertyNames(_config.contexts).find(name => name === normal.context);
      normal.context = [ normal.context ];
      if (!exists) {
        logger.error('#red', 'ERROR:', '#cyan', normal.context, 'is not a software unit in the configuration');
        normal.context = undefined;
      }
    } else {
      normal.context = context.whoami();
      const someContext = normal.context.length > 0;
      normal.context = someContext ? normal.context : undefined;
      if (!someContext) {
        logger.error('#red', 'ERROR:', 'there is no context to execute the command', '#bold', normal.name);
      }
    }

    if (!normal.isStep) {
      normal.flowName = normal.name;
    }

    params.normal = JSON.parse(JSON.stringify(normal));

    return normal;
  };

  /**
   * checks if the params is available and compatible with configurations
   * @param reject : callback function
   * @private
   */
  const check = function(reject, cb) {
    logger.trace('#green', 'sour:check:', 'commands:', params.commands);
    const normal = normalize(params.commands);
    if (!normal.context) {
      return reject('command not available');
    }
    if (config.isAvailable(normal)) {
      return normal;
    }
    if (normal.name) {
      const type = normal.isStep ? 'step' : 'flow';
      logger.error(type, '#green', normal.orig, '#red', 'doesn\'t exist!');
      logger.txt('\n', _config.cmd, '-la for help.', '\n');
      return reject('command not available');
    }
    return docs.help(normal, cb);
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
        logger.info('Your context is:', '[', '#bold', normal.context, ']');
        if (normal.isStep) {
          normal.params = config.getStepParams(normal);
          normal.context.map(context => analytics.hit(`/steps/${context}::${normal.name}`, `step: ${context}::${normal.name}`));
          stepper.execute(normal, _resolve, _reject);
        } else {
          normal.context.map(context => analytics.hit(`/flows/${context}:${normal.name}`, `flow: ${context}:${normal.name}`));
          sipper.execute(normal, params.initStep, params.endStep, _resolve, _reject);
        }
      };

      const executeAnswers = function(answers) {
        try {
          execute(normalize([ answers.command && !answers.step ? answers.command : answers.step ]));
        } catch (e) {
          console.error(e.stack);
          reject(e);
        }
      };

      try {
        if (params.version) {
          docs.version();
          resolve();
        } else if (params.writeCache) {
          scullion.writeCache();
          resolve();
        } else if (params.showContext) {
          logger.txt(context.whoami());
          resolve();
        } else {
          const normal = check(reject, executeAnswers);
          if (normal) {
            normal.init = init;
            if (params.help) {
              docs.help(normal);
              resolve();
            } else {
              execute(normal);
            }
          }
        }

        // Commented until domain implementation were undone
        //if (!params.writeCache) {
        //  spawn(process.execPath, [path.join(config.getDir('module'), 'bin', 'pisco.js'), '-w'], {stdio: ['ignore', process.stdout, process.stderr]});
        //}

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
