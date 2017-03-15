'use strict';

const spawn = require('child_process').spawn;
const spawnSync = require('child_process').spawnSync;
const stream = require('stream');
const logger = require('../logger');

const async = require('async');
const chalk = require('chalk');
const _ = require('lodash');


const launcher = {

  isWin() {
    return process.env.OS && process.env.OS.indexOf('Windows') >= 0;
  },

  sh: function(cmdsh, reject, loud) {
    let result;
    if (launcher.isWin()) {
      result = launcher.executeSync('cmd', ['/c', cmdsh], reject, loud);
    } else {
      result = launcher.executeSync('sh', ['-c', cmdsh], reject, loud);
    }

    return result;
  },

  sudo: function(cmdsh) {
    let args = ['sh', '-c', cmdsh];
    let cmd = 'sudo';
    if (launcher.isWin()) {
      args = ['/c', cmdsh];
      cmd = 'cmd';
    }

    return launcher.executeStreamed(cmd, args);
  },

  executeSync: function(cmd, args, reject, loud) {
    if (cmd !== 'cmd' && cmd !== 'sh') {
      const patch = launcher._windowsPatch(cmd, args);
      cmd = patch.cmd;
      args = patch.args;
    }
    logger.trace('#cyan', 'executing', cmd, args);

    let result;
    if (loud) {
      result = spawnSync(cmd, args, { stdio: ['ignore', process.stdout, process.stderr] });
      const message = 'WARNING!! Use \'loud=false\' if you want to use stdout or stderr';
      result.stdout = message;
      result.stderr = message;
    } else {
      result = spawnSync(cmd, args);
    }

    if ((result.error || result.status !== 0) && reject) {
      reject({ error: result.error, stderr: result.stderr.toString() });
    }

    return result;
  },

  /**
   * Because of this: https://github.com/nodejs/node-v0.x-archive/issues/2318
   *
   * Fast fix for windows environments
   *
   */
  _windowsPatch: function(cmd, args) {
    if (launcher.isWin()) {
      return {
        cmd: 'cmd',
        args: ['/c', cmd].concat(args)
      };
    }

    return { cmd: cmd, args: args };
  },

  executeStreamed: function(cmd, args, options) {
    const patch = launcher._windowsPatch(cmd, args);
    const _cmd = patch.cmd;
    const _args = patch.args;
    if (!options.stdio) {
      options.stdio = [ process.stdin ];
    }
    let child = spawn(_cmd, _args, options);
    logger.trace('#cyan', 'executing async', cmd, args, options);

    return child;
  },

  execute: function(cmd, args, options) {
    let child = launcher.executeStreamed(cmd, args, options || {});
    let error;
    let command = cmd;
    let output = '';
    const mute = options && options.mute;

    if (args) {
      args.forEach((item)=> command += ' ' + item);
    }

    child.on('disconnect', () => {
      logger.info('Child process disconnected!', arguments);
    });

    child.stdout.on('data', (data) => {
      if (!mute) {
        logger.out(data.toString());
      }
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      if (!mute) {
        logger.err(chalk.red(data.toString()));
      }
      error = error ? error : '';
      error += data.toString();
    });

    child.on('error', (e) => {
      if (!mute) {
        logger.error('#red', 'Child process error!', command);
      }
      error = e.code;
    });

    child.on('exit', () => {
      logger.trace('#cyan', command, 'executed');
    });

    return new Promise((resolve, reject) => {
      child.on('close', (code) => {
        logger.trace(command, 'close with code ', code);
        if (code !== 0) {
          logger.info('#cyan', command, 'executed:', '#red', 'KO');
          reject({cmd: cmd, args: args, options: options, status: code, error: error, output: output});
        } else {
          logger.info('#cyan', command, 'executed:', '#green', 'OK');
          resolve({cmd: cmd, args: args, options: options, status: code, output: output});
        }
      });
    });
  },

  executeParallel: function(multiple) {
    let promises = [];
    multiple.forEach((exec) => {
      if (!exec.skip) {
        promises.push(launcher.execute(exec.cmd, exec.args, exec.options));
      }
    });
    return Promise.all(promises);
  },

  executeMassive: function(descriptors, jobs) {
    return new Promise((ok, ko) => {
      const errors = [];
      const process = (pd, cb) => {
        return launcher.execute(pd.cmd, pd.args, pd.options)
          .then(() => cb())
          .catch(err => {
            errors.push(err);
            cb();
          });
      };
      const callback = () => errors.length > 0 ? ko(errors) : ok();
      async.eachLimit(descriptors, jobs, process, callback);
    });
  }
};

module.exports = launcher;