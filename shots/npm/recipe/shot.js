'use strict';

var piscosour = require('../../..'),
    Shot = piscosour.Shot,
    logger = piscosour.logger;

var shot = new Shot({
    description : "Install all npm commands",

    check : function(resolve, reject){
        logger.info("Getting all npm dependencies...","#green","OK");
        resolve({skip:false});
    },

    run : function(resolve, reject){
        logger.info("Installing npm dependencies...");
        shot.executeAll(shot.runner.params.installCmds,resolve, reject);
    }
});

module.exports = shot;