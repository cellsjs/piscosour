'use strict';

var spawn = require('child_process').spawn,
    spawnSync = require('child_process').spawnSync;

module.exports = {
    description: "Launcher plugin",

    addons: {
        sh: function (cmdsh, reject, loud) {
            var result;
            if (this.isWin()) {
                result = this.executeSync("cmd", ["/c", cmdsh], reject, loud);
            }else{
                result = this.executeSync("sh", ["-c", cmdsh], reject, loud);
            }
            return result;
        },
        sudo: function(cmdsh){
            var args = ["sh","-c", cmdsh];
            if (this.isWin())
                args = ["cmd","/c", cmdsh];
            return this.execute("sudo", args);
        },
        executeSync: function (cmd, args, reject, loud) {
            if (cmd!=="cmd" && cmd!=="sh") {
                var patch = this.windowsPatch(cmd,args);
                cmd = patch.cmd;
                args = patch.args;
            }
            this.logger.trace("#cyan", "executing", cmd, args);
            var result = spawnSync(cmd, args);

            if ((result.error || result.status !== 0) && reject)
                reject({error: result.error, stderr: result.stderr.toString()});

            if (loud) {
                this.logger.out(result.stdout.toString());
                this.logger.err(result.stderr.toString());
            }

            return result;
        },
        /**
         * Because of this: https://github.com/nodejs/node-v0.x-archive/issues/2318
         *
         * Fast fix for windows environments
         *
         */
        windowsPatch: function(cmd,args){
            if (this.isWin()){
                args = ["/c",cmd].concat(args);
                cmd = "cmd";
            }
            return {cmd: cmd, args: args};
        },
        execute: function (cmd, args) {
            var patch = this.windowsPatch(cmd,args);
            cmd = patch.cmd;
            args = patch.args;
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
