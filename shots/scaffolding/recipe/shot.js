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
    description : "Create a piscosour recipe",

    config : function(resolve){
        logger.info("#magenta","pre","Preparing piscosour recipe params");
        params.inquire(shot.runner.params.prompts,resolve);
    },

    run : function(resolve, reject){
        logger.info("#magenta","run","Scaffolding Piscosour recipe");
        createDir(path.join(pwd,params.recipeName));
        process.chdir(path.join(pwd,params.recipeName));

        //Execute yeoman externally
        shot.execute("yo",params.addPrompts(["pisco-recipe"], shot.runner.params.prompts),resolve, reject);
    },

    prove : function(resolve){
        logger.info("#magenta","post","creating piscosour recipe");
        resolve();
    }

});

module.exports = shot;