'use strict';

var piscosour = require('../../../index'),
    Shot = piscosour.Shot,
    logger = piscosour.logger;


module.exports = new Shot({
    description : "Create a piscosour recipe",

    pre : function(resolve){
        logger.info("#magenta","pre","creating piscosour recipe");
        resolve();
    },

    run : function(resolve){
        logger.info("#magenta","run","creating piscosour recipe");
        resolve();
    },

    post : function(resolve){
        logger.info("#magenta","post","creating piscosour recipe");
        resolve();
    }

});