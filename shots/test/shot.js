'use strict';

module.exports = {
    description : "TEST Brief description of shot",

    config : function(resolve){
        this.logger.info("#magenta","config","Preparing params for main execution");
    },

    run : function(resolve){
        this.logger.info("#magenta","run","Run main execution");
        this.logger.info("execution: ",this.params.execution);
        this.testPluginAddon(" - test plugin addon!");
    },

    prove : function(resolve){
        this.logger.info("#magenta","prove","Prove that the run execution was ok");
    },

    notify : function(resolve){
        this.logger.info("#magenta","notify","Recollect all execution information and notify");
    }
};