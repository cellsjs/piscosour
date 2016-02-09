'use strict';

var piscosour = require('../../..'),
    path = require('path'),
    fs = require('fs'),
    fsUtils = piscosour.fsUtils,
    config = piscosour.config,
    Shot = piscosour.Shot;

var file = path.join(process.cwd(),'package.json');

var shot = new Shot({
    description : "Convert any nodejs module into a piscosour recipe",

    pkg: fsUtils.readConfig(file),

    check : function(go, stop){
        shot.logger.info("#magenta","check","Check if this is a nodejs module");
        if (!shot.runner.pkg.version)
            stop("Impossible to find package.json");
        if (shot.runner.pkg.keywords && shot.runner.pkg.keywords.indexOf("piscosour-recipe")>=0){
            stop("This is already a piscosour recipe");
        }else {
            return shot.inquire("promptsPisco", go);
        }
    },

    config: function(){
        shot.logger.info("#magenta","config","Configurating package.json");

        if (!shot.runner.pkg.keywords)
            shot.runner.pkg.keywords = [];
        shot.runner.pkg.keywords.push("piscosour-recipe");
        fs.writeFileSync(file,JSON.stringify(shot.runner.pkg,null,4));
        var piscosour = {
            "cmd" : shot.runner.params.cmd,
            "repoTypes" : [],
            "straws" : {}
        };
        fs.writeFileSync("piscosour.json",JSON.stringify(piscosour,null,4));
    },

    run : function(resolve, reject){
        shot.logger.info("#magenta","run","Install piscosour dependency");
        shot.sh("npm install piscosour --save", reject,true);

        shot.logger.info("#magenta","run","Copying files to node module");

        var origin = path.join(config.modulesDir.piscosour,"bin","pisco_");
        var dest = path.join(config.rootDir,"bin");
        var destFile = path.join(dest,"pisco.js");
        fsUtils.createDir(dest);

        return fsUtils.copyFileFiltered(origin, destFile, {resolve: resolve, reject: reject, logger: shot.logger});
    },

    prove : function(resolve, reject){
        shot.logger.info("#magenta","prove","Prove that the new pisco recipe is executable");
        var result = shot.sh("node bin/pisco.js", reject);

        if (result.status !== 0) {
            shot.logger.error("#red", "Error: commnad not executed propelly!", result.stderr.toString());
        }
    },

    notify : function(){
        shot.logger.info("#magenta","notify","Recollect all execution information and notify");
    }

});

module.exports = shot;