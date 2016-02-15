'use strict';

var piscosour = require('../../..'),
    fs = require('fs'),
    path = require('path'),
    Shot = piscosour.Shot,
    fsUtils = piscosour.fsUtils,
    config = piscosour.config;

var file = path.join(process.cwd(),'package.json');

var shot = new Shot({
    description : "Install npm recipe inside this executable",

    pkg: fsUtils.readConfig(file),

    check : function(stop){
        shot.logger.info("#magenta","check","Check all pre-requisites for the execution");
        if (!shot.runner.pkg.version)
            stop("Impossible to find package.json this is not a recipe root directory");
        else{
            var isRecipe = shot.runner.pkg.keywords && shot.runner.pkg.keywords.indexOf("piscosour-recipe") >= 0;
            if (!isRecipe)
                stop("This module is not a piscosour recipe, execute \"pisco convert\" first");
        }
    },

    run : function(resolve, reject){
        shot.logger.info("#magenta","run","Installing recipe");

        var name = shot.runner.params.recipeName;

        if (name.indexOf('https://')>=0) {
            name = path.parse(shot.runner.params.recipeName).name;
            shot.runner.params.recipeName = "git+" + shot.runner.params.recipeName;
        }

        if (fs.existsSync(path.join(config.modulesDir.module,'node_modules',name))) {
            shot.logger.info("#green",name," is already installed in piscosour!!");
            if (shot.runner.params.update) {
                shot.logger.info("updating","#cyan",name);
                shot.sh("npm update", reject, true);
            }
        }else{
            shot.sh("npm install "+shot.runner.params.recipeName+" --save",reject, true);
        }
    },

    prove : function(resolve){
        shot.logger.info("#magenta","prove","Prove that the run execution was ok");
    },

    notify : function(resolve){
        shot.logger.info("#magenta","notify","Recollect all execution information and notify");
    }
});

module.exports = shot;