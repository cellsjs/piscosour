'use strict';

var fs = require('fs'),
    path = require('path');

/**
 * Create a recipe using a yeoman generator. This shot execute yeoman and generate a new recipe using the user introduced parameters.
 */
module.exports = {

    run : function(resolve, reject){
        this.logger.info("#magenta","run","Create new recipe from template");
        this.fsCreateDir(this.params.recipeName);
        process.chdir(this.params.recipeName);
        process.env.NODE_PATH=process.env.NODE_PATH+path.delimiter+path.join(this.config.getDir('module'),"node_modules");
        return this.execute("yo",this.promptArgs(["pisco-recipe"])).then(resolve,reject);
    }
};