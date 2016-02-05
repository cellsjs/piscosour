'use strict';

var piscosour = require('../../..'),
    fs = require('fs'),
    path = require('path'),
    pwd = process.env.PWD,
    Shot = piscosour.Shot;

var createDir = function(dir){
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
};

var shot = new Shot({
    description : "Create a piscosour recipe from a scaffold template",

    run : function(resolve, reject){
        shot.logger.info("#magenta","run","Create new recipe from template");

        createDir(path.join(pwd,shot.runner.params.recipeName));
        process.chdir(path.join(pwd,shot.runner.params.recipeName));
        shot.execute("yo",shot.promptArgs(["pisco-recipe"]),resolve, reject);
    }

});

module.exports = shot;