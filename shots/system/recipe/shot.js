'use strict';

module.exports = {
    description : "Checking System Dependencies for recipe creation",

    run : function(resolve){
        this.logger.info("Solving all system dependencies...","#green","OK");
        // Put here all system dependencies non npm... (f.i. is mac, linux, windows etc...)
    }

};

