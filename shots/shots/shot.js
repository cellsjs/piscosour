'use strict';

var piscosour = require('../..'),
    fs = require('fs'),
    path = require('path'),
    config = piscosour.config,
    fsUtils = piscosour.fsUtils;

module.exports = {
    description : "Create new pisco shot inside this module",

    check : function(go, stop){
        this.logger.info("#magenta","check","Check if this is a piscosour recipe");
        var file = path.join(process.cwd(),'package.json');
        var pkg = fsUtils.readConfig(file);
        if (pkg.version) {
            var isRecipe = pkg.keywords && pkg.keywords.indexOf("piscosour-recipe")>=0;
            if (!isRecipe)
                stop("This module is not a piscosour recipe, execute \"pisco convert\" first");
        }else
            stop("Impossible to find package.json this is not a recipe root directory");

        var dest = path.join(config.rootDir,"shots",this.params.shotName,this.params.repoType);

        if (fsUtils.exists(dest)){
            stop('the shot "'+this.params.shotName+'" already exists for repository type: "'+this.params.repoType+'" in this recipe, edit it to change!');
        }
    },

    config: function(go, stop){
        var file = path.join(config.rootDir, "piscosour.json");
        this.logger.info("#magenta","config","Configure recipe for the new shot in", file);
        var configLocal = fsUtils.readConfig(file);

        if (!configLocal.repoTypes)
            configLocal.repoTypes = [];

        if (configLocal.repoTypes.indexOf(this.params.repoType)<0){
            configLocal.repoTypes.push(this.params.repoType);
        }
        fs.writeFileSync(file,JSON.stringify(configLocal,null,4));
    },

    run : function(resolve, reject){
        this.logger.info("#magenta","run","Creating new shot for this recipe");

        var dest = path.join(config.rootDir,"shots",this.params.shotName,this.params.repoType);
        var origin = path.join(config.getDir('piscosour'),"templates","_shot");

        fsUtils.createDir(path.join(config.rootDir,"shots"));
        fsUtils.createDir(path.join(config.rootDir,"shots",this.params.shotName));
        fsUtils.createDir(dest);

        return fsUtils.copyDirFiltered(origin, dest, {resolve: resolve, reject: reject, logger: this.logger});
    },

    prove : function(resolve, reject){
        this.logger.info("#magenta","prove","Prove if the shot is propelly executed");
        var dest = path.join(config.rootDir,"shots",this.params.shotName,this.params.repoType);
        var result = this.sh("node bin/pisco.js "+this.params.repoType+"::"+this.params.shotName, reject, true);
        if (result.status!==0){
            this.logger.error("#red","Error: shot not propelly created!","cleaning files!");
            this.sh("rm -rf "+dest,reject,true);
        }
        this.save("shotName", this.params.shotName);
        this.save("repoType", this.params.repoType);
    }
};