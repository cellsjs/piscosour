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

    config : function(resolve){
        logger.info("#magenta","config","All configurations labors");
        resolve();
    },

    run : function(resolve, reject){
        logger.info("#magenta","run","Create new recipe from template");
        createDir(path.join(pwd,params.recipeName));
        process.chdir(path.join(pwd,params.recipeName));

        shot.execute("yo",params.addPrompts(["pisco-recipe"], shot.runner.params.prompts),resolve, reject);
    },

    prove : function(resolve){
        logger.info("#magenta","prove","Prove that the run execution was ok");
        resolve();
    }

});

module.exports = shot;