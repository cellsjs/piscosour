'use strict';

const spawn = require('child_process').spawn;
const spawnSync = require('child_process').spawnSync;
const stream = require('stream');

const chalk = require('chalk');
const stripcolorcodes = require('stripcolorcodes');

const streamWriteHook = require('../../lib/utils/stream-write-hook');

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
      let result;
      if (loud) {
        result = spawnSync(cmd, args, {stdio: ['ignore', process.stdout, process.stderr]});
        const message = 'WARNING!! Use \'loud=false\' if you want to use stdout or stderr';
        result.stdout = message;
        result.stderr = message;
      } else {
        result = spawnSync(cmd, args);
      }


      if ((result.error || result.status !== 0) && reject) {
        reject({error: result.error, stderr: result.stderr.toString()});
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
      var child = spawn(cmd, args, { stdio: 'inherit' });
      this.logger.trace('#cyan', 'executing async', cmd, args);
      return child;
    },
    execute: function(cmd, args) {
      let child = this.executeStreamed(cmd, args);
      let error;
      let command = cmd;
      let output = '';
      args.forEach((item)=> command += ' ' + item);

      streamWriteHook.hook(process.stdout, (chunk, encoding, cb) => {
        output += chunk.toString(encoding);
      });

      streamWriteHook.hook(process.stderr, (chunk, encoding, cb) => {
        error = error ? error : '';
        error += chunk.toString(encoding);
      });      

      child.on('disconnect', () => {
        this.logger.info('Child process disconnected!', arguments);
      });

      child.on('error', () => {
        this.logger.error('#red', 'Child process error!', command);
      });

      child.on('exit', () => {
        this.logger.info('#cyan', command, 'executed', '#green', 'ok!');
      });

      return new Promise((resolve, reject) => {
        child.on('close', (code) => {
          this.logger.info('child process exited with code ', code);
          streamWriteHook.unhook(process.stdout);
          streamWriteHook.unhook(process.stderr);
          if (code !== 0) {
            reject({ 
              cmd: cmd, 
              args: args, 
              status: 'ERROR', 
              error: stripcolorcodes(error), 
              output: stripcolorcodes(output) 
            });
          } else {
            resolve({
              cmd: cmd, 
              args: args, 
              status: 'OK', 
              output: stripcolorcodes(output)
            });
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
