'use strict';

let spawn = require('child_process').spawn;
let chalk = require('chalk');
let spawnSync = require('child_process').spawnSync;

module.exports = {

  addons: {
    sh: function(cmdsh, reject, loud) {
      var result;
      if (this.isWin()) {
        result = this.executeSync('cmd', ['/c', cmdsh], reject, loud);
      } else {
        result = this.executeSync('sh', ['-c', cmdsh], reject, loud);
      }
      return result;
    },
    sudo: function(cmdsh) {
      var args = ['sh', '-c', cmdsh];
      var cmd = 'sudo';
      if (this.isWin()) {
        args = ['/c', cmdsh];
        cmd = 'cmd';
      }
      return this.executeStreamed(cmd, args);
    },
    executeSync: function(cmd, args, reject, loud) {
      if (cmd !== 'cmd' && cmd !== 'sh') {
        var patch = this._windowsPatch(cmd, args);
        cmd = patch.cmd;
        args = patch.args;
      }
      this.logger.trace('#cyan', 'executing', cmd, args);
      var result = spawnSync(cmd, args);

      if ((result.error || result.status !== 0) && reject) {
        reject({error: result.error, stderr: result.stderr.toString()});
      }

      if (loud) {
        this.logger.out(result.stdout.toString());
        this.logger.err(chalk.red(result.stderr.toString()));
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
        args = ['/c', cmd].concat(args);
        cmd = 'cmd';
      }
      return {cmd: cmd, args: args};
    },
    executeStreamed: function(cmd, args) {
      var patch = this._windowsPatch(cmd, args);
      cmd = patch.cmd;
      args = patch.args;
      var child = spawn(cmd, args, {stdio: [ process.stdin ]});
      this.logger.trace('#cyan', 'executing async', cmd, args);
      return child;
    },
    execute: function(cmd, args) {
      var child = this.executeStreamed(cmd, args);
      var error;

      child.on('disconnect', () => {
        this.logger.info('Child process disconnected!', arguments);
      });

      child.stdout.on('data', (data) => {
        this.logger.out(data.toString());
      });

      child.stderr.on('data', (data) => {
        this.logger.err(chalk.red(data.toString()));
        error = error ? error : '';
        error += data.toString();
      });

      child.on('error', () => {
        this.logger.error('#red', 'Child process error!', arguments);
      });

      child.on('exit', () => {
        this.logger.info('Child process exit!', arguments);
      });

      return new Promise((resolve, reject) => {
        child.on('close', (code) => {
          this.logger.info('child process exited with code ', code);
          if (code !== 0) {
            reject({cmd: cmd, args: args, status: 'ERROR', error: error});
          } else {
            resolve({cmd: cmd, args: args, status: 'OK'});
          }
        });
      });
    },
    executeParallel: function(multiple) {
      var promises = [];
      multiple.forEach((exec) => {
        if (!exec.skip) {
          promises.push(this.execute(exec.cmd, exec.args));
        }
      });
      return Promise.all(promises);
    }
  }
};
