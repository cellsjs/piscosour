'use strict';

module.exports = {
    description : "TEST 2 Brief description of shot",

    check : function(resolve){
        this.logger.info("#magenta","check","Check all pre-requisites for the execution");
    },

    config : function(resolve, reject){
        this.logger.info("#magenta","config","this.params.saludo: ", this.params.saludo);
        if (this.params.saludo!=="holarecipe")
            reject("ERROR: "+JSON.stringify(this.params));
    },

    run : function(resolve, reject){
        this.logger.info("#magenta","run","Run main execution");
        reject({keep:true, error: "TEST ERROR"});
    },

    prove : function(resolve){
        this.logger.info("#magenta","prove","Prove that the run execution was ok");
    },

    notify : function(resolve){
        this.logger.info("#magenta","notify","Recollect all execution information and notify");
    }

};