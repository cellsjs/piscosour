'use strict';

var path = require('path');

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
                this.logger.info(command, "is installed", ".................", "#green", "OK");
                this.params.installCmds[i].skip = true;
            } else {
                this.logger.info(command, "#yellow", "is not installed!");
                resolve({skip: false});
            }
        }
        resolve({skip:true});
    },

    run : function(resolve, reject){
        this.logger.info("Installing npm dependencies...");
        return this.executeParallel(this.params.installCmds).then(resolve, reject);
    }
};