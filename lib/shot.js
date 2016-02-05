/*jshint node:true */

'use strict';

var logger = require("./logger"),
    runSequence = require('run-sequence'),
    async = require('async'),
    spawn = require('child_process').spawn,
    spawnSync = require('child_process').spawnSync;

/**
 * Definition of a Shot
 * @param runner
 * @returns {Shot}
 * @constructor
 */
var Shot = function(runner){
    this.runner = runner;
    this.logger = logger;
    return this;
};

Shot.prototype.do = function(stage){
    var operation = this.runner[stage];
    if (operation)
        return new Promise(function (resolve, reject) {
            operation(resolve, reject);
            resolve();
        });
    else

};

Shot.prototype.execute = function(cmd,args,resolve, reject){
    var child = spawn(cmd, args,{stdio: [process.stdin]});

    child.on('disconnect', function(){
        logger.info("Child process disconnected!",arguments);
    });

    child.stdout.on('data',function(data){
        logger.out(data.toString());
    });

    child.stderr.on('data',function(data){
        logger.err(data.toString());
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

Shot.prototype.sh = function(cmdsh,reject,loud) {
    var args = ["-c",cmdsh];
    return this.executeSync("sh",args,reject,loud);
};

Shot.prototype.report = function(result) {
    if (!global[this.runner.name])
        global[this.runner.name] = {};

    var report = global[this.runner.name]["xxreport"];
    if (!report)
        report = {
            name: this.runner.name,
            description : this.runner.description,
            results : []
        };

    report.results.push(result);
    global[this.runner.name]["xxreport"] = report;
};

Shot.prototype.save = function(key,obj) {
    if (!global[this.runner.name])
        global[this.runner.name] = {};

    global[this.runner.name][key] = obj;
};

Shot.prototype.get = function(key, shotName) {
    if (!shotName)
        shotName = this.runner.name;
    if (global[shotName])
        return global[shotName][key];
};

Shot.prototype.executeSync = function(cmd,args,reject,loud) {
    logger.info("#cyan","executing",cmd,args);
    var result = spawnSync(cmd, args);

    if ((result.error || result.status!==0) && reject)
        reject({error: result.error, stderr: result.stdout.toString()});

    if (loud) {
        logger.out(result.stdout.toString());
        logger.err(result.stderr.toString());
    }

    return result;
};

Shot.prototype.promptArgs = function(array){
    var prompts = this.runner.params.prompts;
    if (prompts)
        for (var i in prompts){
            var prompt = prompts[i];
            array.push('--'+prompt.name);
            array.push(this.runner.params[prompt.name]);
        }
    return array;
};

Shot.prototype.executeParallel = function(multiple, resolve, reject){

    var z = multiple.length;
    var oks = [];
    var errors = [];
    var skipped = [];

    var checkEnd = function(){
        logger.info("oks.length:",oks.length,"errors.length:",errors.length,"skipped.length:",skipped.length,"multiple.length:",z);
        if ((oks.length+errors.length+skipped.length)===z){
            var results = {"oks": oks,"errors" : errors,"skipped" : skipped};
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
        if (!exec.skip)
            this.execute(exec.cmd,exec.args, onResolve, onReject);
        else{
            skipped.push(exec);
            checkEnd();
        }
    }
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