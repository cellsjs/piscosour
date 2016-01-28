'use strict';

require('../../../lib/pathPolyfill');

var piscosour = require('../../..'),
    path = require('path'),
    Shot = piscosour.Shot,
    logger = piscosour.logger;

var shot = new Shot({
    description : "Checking all npm commands needed",

    check : function(resolve, reject){
        logger.info("Checking all npm commands are already installed");

        for (var i in shot.runner.params.installCmds){
            var command = shot.runner.params.installCmds[i].args[2];

            logger.info("Checking","#cyan",command,"....");
            if (command.indexOf('https://')>=0)
                command = path.parse(command).name;

            var result = shot.executeSync("npm",["list","-g",command]);

            if (result.status===0) {
                logger.info(command, "is installed", ".................", "#green", "OK");
                shot.runner.params.installCmds[i].skip = true;
            } else {
                logger.info(command, "#yellow", "is not installed!");
                resolve({skip: false});
            }
        }
        resolve({skip:true});
    },

    run : function(resolve, reject){
        logger.info("Installing npm dependencies...");
        shot.executeParallel(shot.runner.params.installCmds,resolve, reject);
    }
});

module.exports = shot;