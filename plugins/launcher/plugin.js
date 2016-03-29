'use strict';

var spawn = require('child_process').spawn,
    spawnSync = require('child_process').spawnSync;

module.exports = {
    description: "Launcher plugin",

    addons: {
        sh: function (cmdsh, reject, loud) {
            var args = ["-c", cmdsh];
            return this.executeSync("sh", args, reject, loud);
        },
        executeSync: function (cmd, args, reject, loud) {
            this.logger.trace("#cyan", "executing", cmd, args);
            var result = spawnSync(cmd, args);

            if ((result.error || result.status !== 0) && reject)
                reject({error: result.error, stderr: result.stdout.toString()});

            if (loud) {
                this.logger.out(result.stdout.toString());
                this.logger.err(result.stderr.toString());
            }

            return result;
        },
        execute: function (cmd, args) {
            var child = spawn(cmd, args, {stdio: [process.stdin]});
            this.logger.trace("#cyan", "executing async", cmd, args);

            child.on('disconnect', function () {
                this.logger.info("Child process disconnected!", arguments);
            }.bind(this));

            child.stdout.on('data', function (data) {
                this.logger.out(data.toString());
            }.bind(this));

            child.stderr.on('data', function (data) {
                this.logger.err(data.toString());
            }.bind(this));

            child.on('error', function () {
                this.logger.error("Child process error!", arguments);
            }.bind(this));

            child.on('exit', function () {
                this.logger.info("Child process exit!", arguments);
            }.bind(this));

            return new Promise(function (resolve, reject){
                child.on('close', function (code) {
                    this.logger.info("child process exited with code ", code);
                    if (code !== 0) {
                        reject({cmd: cmd, args: args, status: "ERROR"});
                    } else {
                        resolve({cmd: cmd, args: args, status: "OK"});
                    }
                }.bind(this));
            }.bind(this));
        },
        executeParallel: function (multiple) {
            var promises = [];
            for (var i in multiple) {
                var exec = multiple[i];
                if (!exec.skip)
                    promises.push(this.execute(exec.cmd, exec.args));
            }
            return Promise.all(promises);
        }
    }
};