'use strict';

const spawn = require('child_process').spawn;
const spawnSync = require('child_process').spawnSync;
const stream = require('stream');

const async = require('async');
const chalk = require('chalk');
const _ = require('lodash');


module.exports = {
  addons: {

    sh: function(cmdsh, reject, loud) {
      let result;
      if (this.isWin()) {
        result = this.executeSync('cmd', ['/c', cmdsh], reject, loud);
      } else {
        result = this.executeSync('sh', ['-c', cmdsh], reject, loud);
      }

      return result;
    },

    sudo: function(cmdsh) {
      let args = ['sh', '-c', cmdsh];
      let cmd = 'sudo';
      if (this.isWin()) {
        args = ['/c', cmdsh];
        cmd = 'cmd';
      }

      return this.executeStreamed(cmd, args);
    },

    executeSync: function(cmd, args, reject, loud) {
      if (cmd !== 'cmd' && cmd !== 'sh') {
        const patch = this._windowsPatch(cmd, args);
        cmd = patch.cmd;
        args = patch.args;
      }
      this.logger.trace('#cyan', 'executing', cmd, args);

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
      if (this.isWin()) {
        return {
          cmd: 'cmd',
          args: ['/c', cmd].concat(args)
        };
      }

      return { cmd: cmd, args: args };
    },

    executeStreamed: function(cmd, args, options) {
      const patch = this._windowsPatch(cmd, args);
      const _cmd = patch.cmd;
      const _args = patch.args;
      const _options = _.merge({}, options, { stdio: [ process.stdin ] });
      let child = spawn(_cmd, _args, _options);
      this.logger.trace('#cyan', 'executing async', cmd, args, options);

      return child;
    },

    execute: function(cmd, args, options) {
      let child = this.executeStreamed(cmd, args, options || {});
      let error;
      let command = cmd;
      let output = '';

      args.forEach((item)=> command += ' ' + item);

      child.on('disconnect', () => {
        this.logger.info('Child process disconnected!', arguments);
      });

      child.stdout.on('data', (data) => {
        this.logger.out(data.toString());
        output += data.toString();
      });

      child.stderr.on('data', (data) => {
        this.logger.err(chalk.red(data.toString()));
        error = error ? error : '';
        error += data.toString();
      });

      child.on('error', () => {
        this.logger.error('#red', 'Child process error!', command);
      });

      child.on('exit', () => {
        this.logger.info('#cyan', command, 'executed');
      });

      return new Promise((resolve, reject) => {
        child.on('close', (code) => {
          this.logger.info('child process exited with code ', code);
          if (code !== 0) {
            reject({cmd: cmd, args: args, options: options, status: 'ERROR', error: error, output: output});
          } else {
            resolve({cmd: cmd, args: args, options: options, status: 'OK', output: output});
          }
        });
      });
    },

    executeParallel: function(multiple) {
      let promises = [];
      multiple.forEach((exec) => {
        if (!exec.skip) {
          promises.push(this.execute(exec.cmd, exec.args, exec.options));
        }
      });
      return Promise.all(promises);
    },

    executeMassive: function(descriptors, jobs) {
      return new Promise((ok, ko) => {
        const errors = [];
        const process = (pd, cb) => {
          return this.execute(pd.cmd, pd.args, pd.options)
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
  }
};