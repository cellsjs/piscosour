'use strict';

var piscosour = require('../../..'),
    fs = require('fs'),
    path = require('path'),
    config = piscosour.config,
    fsUtils = piscosour.fsUtils,
    Shot = piscosour.Shot;

var shot = new Shot({
    description : "Create new pisco shot inside this module",

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

        var dest = path.join(config.rootDir,"shots",shot.runner.params.shotName,shot.runner.params.repoType);

        if (fs.existsSync(dest)){
            stop('the shot "'+shot.runner.params.shotName+'" already exists for repository type: "'+shot.runner.params.repoType+'" in this recipe, edit it to change!');
        }
    },

    config: function(go, stop){
        var file = path.join(config.rootDir, "piscosour.json");
        shot.logger.info("#magenta","config","Configure recipe for the new shot in", file);
        var configLocal = fsUtils.readConfig(file);

        if (!configLocal.repoTypes)
            configLocal.repoTypes = [];

        if (configLocal.repoTypes.indexOf(shot.runner.params.repoType)<0){
            configLocal.repoTypes.push(shot.runner.params.repoType);
        }
        fs.writeFileSync(file,JSON.stringify(configLocal,null,4));
    },

    run : function(resolve, reject){
        shot.logger.info("#magenta","run","Creating new shot for this recipe");

        var dest = path.join(config.rootDir,"shots",shot.runner.params.shotName,shot.runner.params.repoType);
        var origin = path.join(config.modulesDir.piscosour,"shots","_shot");

        fsUtils.createDir(path.join(config.rootDir,"shots"));
        fsUtils.createDir(path.join(config.rootDir,"shots",shot.runner.params.shotName));
        fsUtils.createDir(dest);

        return fsUtils.copyDirFiltered(origin, dest, {resolve: resolve, reject: reject, logger: shot.logger});
    },

    prove : function(resolve, reject){
        shot.logger.info("#magenta","prove","Prove that the shot is propelly executed");
        var dest = path.join(config.rootDir,"shots",shot.runner.params.shotName,shot.runner.params.repoType);
        var result = shot.sh("node bin/pisco.js -s "+shot.runner.params.repoType+":"+shot.runner.params.shotName, reject, true);
        if (result.status!==0){
            shot.logger.error("#red","Error: shot not propelly created!","cleaning files!");
            shot.sh("rm -rf "+dest,reject,true);
        }
        shot.save("shotName", shot.runner.params.shotName);
        shot.save("repoType", shot.runner.params.repoType);
    }
});

module.exports = shot;