'use strict';

var piscosour = require('../../..'),
    Shot = piscosour.Shot,
    logger = piscosour.logger;

var shot = new Shot({
    description : "Checking System Dependencies for recipe creation",

    run : function(resolve){
        logger.info("Solving all system dependencies...","#green","OK");
        // Put here all system dependencies non npm... (f.i. is mac, linux, windows etc...)
    }

});

module.exports = shot;