'use strict';

var piscosour = require('../../..'),
    fs = require('fs'),
    path = require('path'),
    pwd = process.env.PWD,
    fsUtils = piscosour.fsUtils,
    Shot = piscosour.Shot;

var shot = new Shot({
    description : "Create a piscosour recipe from a scaffold template",

    run : function(resolve, reject){
        shot.logger.info("#magenta","run","Create new recipe from template");

        fsUtils.createDir(path.join(pwd,shot.runner.params.recipeName));
        process.chdir(path.join(pwd,shot.runner.params.recipeName));
        return shot.execute("yo",shot.promptArgs(["pisco-recipe"]),resolve, reject);
    }

});

module.exports = shot;