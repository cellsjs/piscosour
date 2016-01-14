'use strict';

var piscosour = require('../../../index'),
    Shot = piscosour.Shot,
    logger = piscosour.logger;


var shot = new Shot({
    description : "Create a piscosour recipe",

    pre : function(resolve){
        logger.info("#magenta","pre","creating piscosour recipe");
        resolve();
    },

    run : function(resolve, reject){
        logger.info("#magenta","run","Executing yeoman ... creating piscosour recipe");
        shot.execute("yo",["pisco-recipe"],resolve, reject);
    },

    post : function(resolve){
        logger.info("#magenta","post","creating piscosour recipe");
        resolve();
    }

});

module.exports = shot;