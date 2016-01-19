/*jshint node:true */

'use strict';

var logger = require("./logger"),
    runSequence = require('run-sequence'),
    async = require('async'),
    spawn = require('child_process').spawn;

/**
 * Definition of a Shot
 * @param runner
 * @returns {Shot}
 * @constructor
 */
var Shot = function(runner){
    this.runner = runner;
    return this;
};

Shot.prototype.do = function(stage){
    var operation = this.runner[stage];
    if (operation)
        return new Promise(function (resolve, reject) {
            operation(resolve, reject);
        });
    else
        return;
};

Shot.prototype.execute = function(cmd,args,resolve, reject){
    const child = spawn(cmd, args,{stdio: [process.stdin,process.stdout,process.stderr]});

    child.on('disconnect', function(){
        logger.info("Child process disconnected!",arguments);
    });

    child.on('error', function(){
        logger.error("Child process error!",arguments);
    });

    child.on('exit', function(){
        logger.info("Child process exit!",arguments);
    });

    child.on('close', function(code){
        logger.info("child process exited with code ",code);
        if (code!==0){
            reject({cmd: cmd, args: args, status: "ERROR"});
        }else{
            resolve({cmd: cmd, args: args, status: "OK"});
        }
    });
};

Shot.prototype.executeAll = function(multiple, resolve, reject){

    var z = multiple.length;
    var oks = [];
    var errors = [];

    var checkEnd = function(){
        if ((oks.length+errors.length)===z){
            var results = {"oks": oks,"errors" : errors};
            if (errors.length>0) {
                reject(results);
            }else {
                resolve(results);
            }
        }
    };

    var onResolve = function(res){
        logger.info(res.cmd,res.args,"executed..........","#green",res.status);
        oks.push(res);
        checkEnd();
    };

    var onReject = function(res){
        logger.info(res.cmd,res.args,"executed..........","#red",res.status);
        errors.push(res);
        checkEnd();
    };

    for (var i in multiple){
        var exec = multiple[i];
        this.execute(exec.cmd,exec.args, onResolve, onReject);
    };
};

Shot.prototype.runGulp = function(cmd,resolve, reject) {
    runSequence(cmd, function (err) {
        if (err) {
            logger.error("Finished '", "#cyan", cmd);
            reject();
        } else {
            logger.info("Finished '", "#cyan", cmd);
            resolve();
        }
    });
};

module.exports = Shot;