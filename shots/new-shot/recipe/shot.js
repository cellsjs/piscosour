'use strict';

var piscosour = require('../../..'),
    fs = require('fs'),
    path = require('path'),
    config = piscosour.config,
    Shot = piscosour.Shot;

var shot = new Shot({
    description : "Create new pisco shot inside this module",

    check : function(resolve){
        shot.logger.info("#magenta","check","Check if this is a piscosour recipe");
        var pkg = require(path.join(config.modulesDir.module,'package.json'));
    },

    config : function(resolve){
        shot.logger.info("#magenta","config","Preparing params for main execution");
    },

    run : function(resolve){
        shot.logger.info("#magenta","run","Run main execution");
    },

    prove : function(resolve){
        shot.logger.info("#magenta","prove","Prove that the run execution was ok");
    },

    notify : function(resolve){
        shot.logger.info("#magenta","notify","Recollect all execution information and notify");
    }

});

module.exports = shot;