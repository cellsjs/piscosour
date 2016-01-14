'use strict';

var piscosour = require('../../../index'),
    Shot = piscosour.Shot,
    logger = piscosour.logger;


module.exports = new Shot({
    name : "ejemplo",

    pre : function(resolve){
        logger.info("pre---------->");
        resolve();
    },

    run : function(resolve){
        logger.info("run---------->");
        resolve();
    }

});