'use strict';

var piscosour = require('../../..'),
    fs = require('fs'),
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


        var prompts = [
            {
                "type": "input",
                "name": "recipeName",
                "message": "Choose a name for your pisco recipe"
            },
            {
                "type": "input",
                "name": "description",
                "message": "Write a brief description for your recipe"
            }
        ];

        //params.inquire(piscosour.params.prompts,resolve);
        params.inquire(prompts,resolve);
    },



    run : function(resolve, reject){
        logger.info("#magenta","run","Scaffolding Piscosour recipe");
        createDir(pwd+"/"+params.recipeName);
        process.chdir(pwd+"/"+params.recipeName);
        shot.execute("yo",["pisco-recipe","--recipeName",params.recipeName,"--description",params.description],resolve, reject);
    },

    prove : function(resolve){
        logger.info("#magenta","post","creating piscosour recipe");
        resolve();
    }



});

module.exports = shot;