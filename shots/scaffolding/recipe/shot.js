'use strict';

var piscosour = require('../../..'),
    fs = require('fs'),
    path = require('path'),
    pwd = process.env.PWD;

/**
 * Create a recipe using a yeoman generator. This shot execute yeoman and generate a new recipe using the user introduced parameters.
 */
module.exports = {
    description : "Create a piscosour recipe from a scaffold template",

    run : function(resolve, reject){
        this.logger.info("#magenta","run","Create new recipe from template");

        this.fsCreateDir(path.join(pwd,this.params.recipeName));
        process.chdir(path.join(pwd,this.params.recipeName));
        return this.execute("yo",this.promptArgs(["pisco-recipe"])).then(resolve,reject);
    }
};