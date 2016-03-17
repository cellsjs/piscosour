'use strict';

var piscosour = require('../..'),
    Shot = piscosour.Shot;

var shot = new Shot({
    description : "TEST Brief description of shot",

    config : function(resolve){
        shot.logger.info("#magenta","config","Preparing params for main execution");
    },

    run : function(resolve){
        shot.logger.info("#magenta","run","Run main execution");
        shot.logger.info("execution: ",shot.runner.params.execution);
        shot.pluginAddon(" - test plugin addon!");
    },

    prove : function(resolve){
        shot.logger.info("#magenta","prove","Prove that the run execution was ok");
    },

    notify : function(resolve){
        shot.logger.info("#magenta","notify","Recollect all execution information and notify");
    }

});

module.exports = shot;