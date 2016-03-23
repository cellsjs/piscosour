'use strict';

var logger = require("../../lib/logger"),
    spawn = require('child_process').spawn,
    spawnSync = require('child_process').spawnSync;

module.exports = {
    description: "Launcher plugin",

    addons: {
        sh: function (cmdsh, reject, loud) {
            var args = ["-c", cmdsh];
            return this.executeSync("sh", args, reject, loud);
        },
        executeSync: function (cmd, args, reject, loud) {
            logger.trace("#cyan", "executing", cmd, args);
            var result = spawnSync(cmd, args);

            if ((result.error || result.status !== 0) && reject)
                reject({error: result.error, stderr: result.stdout.toString()});

            if (loud) {
                logger.out(result.stdout.toString());
                logger.err(result.stderr.toString());
            }

            return result;
        },
        execute: function (cmd, args) {
            var child = spawn(cmd, args, {stdio: [process.stdin]});
            logger.trace("#cyan", "executing async", cmd, args);

            child.on('disconnect', function () {
                logger.info("Child process disconnected!", arguments);
            });

            child.stdout.on('data', function (data) {
                logger.out(data.toString());
            });

            child.stderr.on('data', function (data) {
                logger.err(data.toString());
            });

            child.on('error', function () {
                logger.error("Child process error!", arguments);
            });

            child.on('exit', function () {
                logger.info("Child process exit!", arguments);
            });

            return new Promise(function (resolve, reject){
                child.on('close', function (code) {
                    logger.info("child process exited with code ", code);
                    if (code !== 0) {
                        reject({cmd: cmd, args: args, status: "ERROR"});
                    } else {
                        resolve({cmd: cmd, args: args, status: "OK"});
                    }
                });
            });
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