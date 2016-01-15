'use strict';

var piscosour = require('../../..'),
    Shot = piscosour.Shot,
    logger = piscosour.logger;

var shot = new Shot({
    description : "Checking System Dependencies for app creation",

    // all stage implementation
    pre : function(resolve, reject){
        logger.info("Getting all system dependencies...","#green","OK");
        resolve();
    },

    run : function(resolve,reject){
        logger.info("Solving system dependencies...","#green","OK");
        resolve();
    },

    post : function(resolve){
        logger.info("Checking all system dependencies...","#green","OK");
        resolve();
    }

});

module.exports = shot;