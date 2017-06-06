'use strict';

const path = require('path');

const moment = require('moment');

const analytics = require('./analytics');
const bus = require('./bus');
const config = require('./config');
const context = require('./context');
const docs = require('./docs');
const execution = require('./execution');
const logger = require('./logger');
const params = require('./params');
const scullion = require('./globalScullion');
const sipper = require('./sipper');
const stepper = require('./stepper');

/**
 * Sour is the commands line interface
 * @returns gush : execute the commands.
 * @constructor Sour
 */
module.exports = function() {

  const _config = config.get();

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
      normal.contextFixed = true;
      if (!exists) {
        logger.error('#red', 'ERROR:', '#cyan', normal.context, 'is not a software unit in the configuration');
        normal.context = undefined;
      }
    } else {
      normal.context = context.whoami();
      normal.context = normal.context.length > 0 ? normal.context : undefined;
    }

    if (params.all) {
      normal.context = config.allContexts();
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

    if (normal.orig === '') {
      return docs.help(normal, cb);
    }

    if (!normal.context) {
      logger.error('#red', 'ERROR:', 'command', '#cyan', normal.orig, 'needs a context of execution');
      return reject();
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
    return docs.showDisclaimer().then(() => new Promise((resolve, reject) => {
      logger.trace('#green', 'sour:gush', 'commands:', params.commands);

      const _resolve = function() {
        const lastFinished = execution.lastFinished('flow') || execution.lastFinished('step');
        if (lastFinished.stats.hardOk()) {
          bus.emit('command:end', { status: 0 });
          resolve.apply(this, arguments);
        } else {
          bus.emit('command:end', { status: 1 });
          reject.apply(this, arguments);
        }
      };

      const _reject = function() {
        if (arguments[0].notBuilt) {
          logger.info('Execution', '#green', 'NOT BUILT');
          bus.emit('command:end', {status: 2});
          resolve.apply(this, arguments);
        } else {
          bus.emit('command:end', {status: 1});
          reject.apply(this, arguments);
        }
      };

      const execute = function(normal) {
        logger.info('Execution contexts:', '[', '#bold', normal.context.join(', '), ']');
        bus.emit('command:start', normal);
        if (normal.isStep) {
          normal.params = config.getStepParams(normal);
          normal.context.map(ctx => analytics.hit(`/steps/${ctx}::${normal.name}`, `step: ${ctx}::${normal.name}`));
          stepper.execute(normal, _resolve, _reject);
        } else {
          normal.context.map(ctx => analytics.hit(`/flows/${ctx}:${normal.name}`, `flow: ${ctx}:${normal.name}`));
          sipper.execute(normal, params.initStep, params.endStep, _resolve, _reject);
        }
      };

      const executeAnswers = function(answers) {
        try {
          const command = answers.command && !answers.step ? answers.command : answers.step;
          params.commands.push(command);
          execute(normalize([ command ]));
        } catch (e) {
          console.error(e.stack);
          reject(e);
        }
      };

      try {
        if (params.version) {
          docs.version();
          resolve();
        } else if (params.functionalTests) {
          require('./functionalTests').run(resolve, reject);
        } else if (params.saveRequirements && params.commands.length === 0) {
          config.saveRequirements().then(resolve, reject);
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
        //  const spawn = require('child_process').spawn;
        //  spawn(process.execPath, [path.join(config.getDir('module'), 'bin', 'pisco.js'), '-w'], {stdio: ['ignore', process.stdout, process.stderr]});
        //}

      } catch (e) {
        console.error(e.stack);
        reject(e);
      }
    }));
  };

  return {
    gush: gush
  };
};
