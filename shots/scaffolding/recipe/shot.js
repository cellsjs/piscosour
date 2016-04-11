'use strict';

var fs = require('fs'),
    path = require('path');

/**
 * Create a recipe using a yeoman generator. This shot execute yeoman and generate a new recipe using the user introduced parameters.
 */
module.exports = {

    run : function(resolve, reject){
        this.logger.info("#magenta","run","Create new recipe from template");

        this.fsCreateDir(path.join(this.config.rootDir,this.params.recipeName));
        process.chdir(path.join(this.config.rootDir,this.params.recipeName));
        return this.execute("yo",this.promptArgs(["pisco-recipe"])).then(resolve,reject);
    }
};