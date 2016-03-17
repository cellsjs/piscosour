'use strict';

var piscosour = require('../..'),
    fs = require('fs'),
    path = require('path'),
    config = piscosour.config,
    fsUtils = piscosour.fsUtils,
    Shot = piscosour.Shot;

var shot = new Shot({
    description : "Configure piscosour.json",

    file : path.join(config.rootDir, "piscosour.json"),

    whenDefaultType:  function(answer){
        return answer.doDefault;
    },

    check : function(go, stop){
        shot.logger.info("#magenta","check","Check if this is a piscosour recipe");
        var file = path.join(process.cwd(),'package.json');
        var pkg = fsUtils.readConfig(file);
        if (pkg.version) {
            var isRecipe = pkg.keywords && pkg.keywords.indexOf("piscosour-recipe")>=0;
            if (!isRecipe)
                stop("This module is not a piscosour recipe, execute \"pisco convert\" first");
        }else
            stop("Impossible to find package.json this is not a recipe root directory");
    },

    config: function(go, stop){
        shot.logger.info("#magenta","config","Configure recipe", shot.runner.file);
        var configLocal = fsUtils.readConfig(shot.runner.file);

        if (shot.runner.params.defaultType) {

            if (!configLocal.repoTypes)
                configLocal.repoTypes = [];

            if (configLocal.repoTypes.indexOf(shot.runner.params.defaultType) < 0) {
                configLocal.repoTypes.push(shot.runner.params.defaultType);
            }

            configLocal.defaultType = shot.runner.params.defaultType;

            fs.writeFileSync(shot.runner.file, JSON.stringify(configLocal, null, 4));
        }

        var fixDeprecated = function(){
            for (var name in configLocal.straws){
                var local = configLocal.straws[name];
                var strawFile = path.join(config.rootDir,"straws",name,"straw.json");
                var straw = fsUtils.readConfig(strawFile);
                straw.type =local.type;
                straw.name = local.name;
                straw.description = local.description;
                fs.writeFileSync(strawFile,JSON.stringify(straw,null,4));
            }
            delete configLocal.straws;
            fs.writeFileSync(shot.runner.file,JSON.stringify(configLocal,null,4));
            shot.logger.info("#green","piscosour.json fixed!");
            go();
        };

        if (configLocal.straws){
            shot.inquirer_inquire("promptsPisco").then(fixDeprecated);
            return true;
        };
    }

});

module.exports = shot;