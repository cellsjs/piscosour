'use strict';

var piscosour = require('../../../index'),
    Shot = piscosour.Shot,
    logger = piscosour.logger;


module.exports = new Shot({
    description : "Install all npm utils",

    // all stage implementation
    pre : function(resolve){
        logger.info("Getting all system dependencies...","#green","OK");
        resolve();
    },

    run : function(resolve){
        logger.info("Solving system dependencies...","#green","OK");
        resolve();
    },

    post : function(resolve){
        logger.info("Checking all system dependencies...","#green","OK");
        resolve();
    }

});