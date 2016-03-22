'use strict';

var piscosour = require('../../..'),
    fs = require('fs'),
    path = require('path'),
    fsUtils = piscosour.fsUtils,
    config = piscosour.config;

var file = path.join(process.cwd(),'package.json');

module.exports = {
    description : "Install npm recipe inside this executable",

    pkg: fsUtils.readConfig(file),

    check : function(stop){
        this.logger.info("#magenta","check","Check all pre-requisites for the execution");
        if (!this.runner.pkg.version)
            stop("Impossible to find package.json this is not a recipe root directory");
        else{
            var isRecipe = this.runner.pkg.keywords && this.runner.pkg.keywords.indexOf("piscosour-recipe") >= 0;
            if (!isRecipe)
                stop("This module is not a piscosour recipe, execute \"pisco convert\" first");
        }
    },

    run : function(resolve, reject){
        this.logger.info("#magenta","run","Installing recipe");

        var name = this.params.recipeName;

        if (name.indexOf('https://')>=0) {
            name = path.parse(this.params.recipeName).name;
            this.params.recipeName = "git+" + this.params.recipeName;
        }

        if (fsUtils.exists(path.join(config.getDir('module'),'node_modules',name))) {
            this.logger.info("#green",name," is already installed in piscosour!!");
            if (this.params.update) {
                this.logger.info("updating","#cyan",name);
                this.sh("npm update", reject, true);
            }
        }else{
            this.sh("npm install "+this.params.recipeName+" --save",reject, true);
        }
    },

    prove : function(resolve){
        this.logger.info("#magenta","prove","Prove that the run execution was ok");
    },

    notify : function(resolve){
        this.logger.info("#magenta","notify","Recollect all execution information and notify");
    }
};

