'use strict';

const config = require('./config');
const logger = require('./logger');
const fsUtils = require('./utils/fsUtils');
const moment = require('moment');
const path = require('path');

/**
 *
 * Run one shot. Is the responsible to run all the stages of a shot.
 *
 * @returns {{execute: execute}}
 * @module shooter
 */
const shooter = function() {

  let shot;

  const _setWorkingDir = function() {
    const dirName = path.join(config.rootDir, shot.params.workingDir);
    logger.trace('#green', 'shooter', 'workingDir:', '#cyan', dirName);

    if (fsUtils.exists(dirName)) {
      process.chdir(dirName);
    } else {
      logger.warn('#yellow', 'workingDir:', '#cyan', dirName, '#yellow', 'doesn\'t exists!!!', 'go to execution directory instead ->', config.rootDir);
      shot.params.workingDir = '';
      process.chdir(config.rootDir);
    }
  };

  /**
   * Execute shot by shot recursively and synchronized!
   * @param n
   * @param resolve
   * @param reject
   */
  const _synchro = function(n, resolve, reject) {

    const _report = function(content, status, last) {
      const end = moment();
      return {
        status: status,
        message: (n + 1) + '-' + config.stages[n],
        content: content,
        time: (end - shot.init),
        order: shot.order,
        last: last
      };
    };

    const _resolve = function(result) {
      const isLast = n === config.stages.length - 1;
      shot.report(_report(result, 0, isLast));
      if (result && result.skip || isLast) {
        logger.info('\n\n', '#magenta', 'Finished', '|', '#green', shot.params.description, '-', '#duration', moment() - shot.initShot, '\n');
        resolve(shot.outputs);
      } else {
        _synchro(n + 1, resolve, reject);
      }
    };

    const _reject = function(err) {
      logger.error('#green', 'shooter', 'error on', '#cyan', config.stages[n], '(', n, 'of', config.stages.length, ')', '#red', 'ERROR', (err && err.error || err));
      shot.report(_report(err, 1, !err || !err.keep));
      if (err && err.keep) {
        _synchro(n + 1, resolve, reject);
      } else {
        logger.info('\n\n', '#magenta', 'Finished', '|', '#green', shot.params.description, '-', '#duration', moment() - shot.initShot, '\n');
        reject(err);
      }
    };

    if (n < config.stages.length) {

      logger.trace('#green', 'shooter', 'running', '#cyan', config.stages[n], '(', n, 'of', config.stages.length, ')');
      _setWorkingDir();

      if (!shot.params.pstage || config.stages[n] === shot.params.pstage) {

        shot._doPlugins(config.stages[n])
          .then((result) => {
            if (result && result.skip === true) {
              return Promise.resolve(result);
            }
            const promise = shot._do(config.stages[n]);
            if (promise) {
              return promise;
            } else {
              return Promise.resolve({skipped: true});
            }
          })
          .then(_resolve)
          .catch((err) => _reject(err));

      } else {
        _resolve();
      }

    } else {
      resolve();
    }
  };

  /**
   * Execute one shot with conditions checks
   *
   * @param normal shot name
   */
  const execute = function(normal, resolve, reject) {
    shot = config.load(normal);
    shot.initShot = moment();
    shot.order = normal.order ? normal.order : 0;
    if (shot._do) {
      logger.info('\n\n', '#magenta', 'Starting', '|', '#green', shot.params.description, '| [', '#bold', normal.orig, ']', '\n');
      _synchro(0, resolve, reject);
    } else {
      reject('Shot "' + normal.name + '" is not defined for repository Type: "' + normal.repoType + '"');
    }
  };

  return {
    execute: execute
  };
};

module.exports = shooter();
