'use strict';

var path = require('path'),
    semver = require('semver');

module.exports = {

    check : function(resolve){
        this.logger.info("Checking all npm commands are already installed");

        for (var i in this.params.installCmds){
            var command = this.params.installCmds[i].args[2];

            this.logger.info("Checking","#cyan",command,"....");
            if (command.indexOf('https://')>=0)
                command = path.parse(command).name;

            var result = this.executeSync("npm",["list","-g","--depth", "1",command]);

            if (result.status===0) {
                let version = this.runner._getVersion(result.stdout.toString());
                if (this.params.installCmds[i].version && semver.lt(version,this.params.installCmds[i].version)) {
                    this.logger.info(command, "is installed .................", "#yellow", "OUT OF DATE!");
                    this.logger.info("version: ", version,"must to be up to",this.params.installCmds[i].version);
                    this.params.installCmds[i].args[0] = "update";
                    resolve({skip: false});
                } else {
                    this.logger.info(command, "is installed .................", "#green", "OK");
                    this.logger.info("version: ", version);
                    this.params.installCmds[i].skip = true;
                }
            } else {
                this.logger.info(command, "#red", "is not installed!");
                resolve({skip: false});
            }
        }
        resolve({skip:true});
    },

    _getVersion : function(str){
        return str!==undefined?str.split("@")[1]:"";
    },

    run : function(resolve, reject){
        this.logger.info("Installing npm dependencies...");
        return this.executeParallel(this.params.installCmds).then(resolve, reject);
    }
};