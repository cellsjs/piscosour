'use strict';

var piscosour = require('piscosour'),
    Shot = piscosour.Shot;

var shot = new Shot({
    description : "Brief description of shot",

    check : function(){
        shot.logger.info("#magenta","check","Check all pre-requisites for the execution");
    },

    config : function(){
        shot.logger.info("#magenta","config","Preparing params for main execution");
    },

    run : function(){
        shot.logger.info("#magenta","run","Run main execution");
    },

    prove : function(){
        shot.logger.info("#magenta","prove","Prove that the run execution was ok");
    },

    notify : function(){
        shot.logger.info("#magenta","notify","Recollect all execution information and notify");
    }

});

module.exports = shot;