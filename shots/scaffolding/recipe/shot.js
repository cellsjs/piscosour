'use strict';

var piscosour = require('../../..'),
    fs = require('fs'),
    path = require('path'),
    pwd = process.env.PWD,
    Shot = piscosour.Shot,
    params = piscosour.params,
    logger = piscosour.logger;

var createDir = function(dir){
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
};

var shot = new Shot({
    description : "Create a piscosour recipe from a scaffold template",

    run : function(resolve, reject){
        logger.info("#magenta","run","Create new recipe from template");
        createDir(path.join(pwd,shot.runner.params.recipeName));
        process.chdir(path.join(pwd,shot.runner.params.recipeName));

        shot.execute("yo",params.addPrompts(["pisco-recipe"], shot.runner.params.prompts),resolve, reject);
    }
});

module.exports = shot;