'use strict';

var piscosour = require('../../..'),
    path = require('path'),
    fs = require('fs'),
    fsUtils = piscosour.fsUtils,
    config = piscosour.config;

module.exports = {
    description : "Convert any nodejs module into a piscosour recipe",

    check : function(go, stop){
        this.logger.info("#magenta","check","Check if this is a nodejs module");
        if (this.isRecipe()){
            stop("This is already a piscosour recipe");
        }else {
            this.inquire("promptsPisco").then(go);
            return true;
        }
    },

    modifyPkg : function(){
        this.logger.info("#cyan","Modify","package.json");
        if (!this.pkg.keywords)
            this.pkg.keywords = [];

        this.pkg.keywords.push("piscosour-recipe");
        if (!this.pkg.bin)
            this.pkg.bin = {};

        this.pkg.bin[this.params.cmd] = "bin/pisco.js";

        fs.writeFileSync(this.pkgFile,JSON.stringify(this.pkg,null,4));
    },

    writePiscosour : function(){
        this.logger.info("#cyan","Write","piscosour.json");
        var piscosour = {
            "cmd" : this.params.cmd,
            "repoTypes" : []
        };
        fs.writeFileSync("piscosour.json",JSON.stringify(piscosour,null,4));
    },

    config: function(){
        this.logger.info("#magenta","config","Configurating package.json");
        this.runner.modifyPkg();
        this.runner.writePiscosour();
    },

    run : function(resolve, reject){
        this.logger.info("#magenta","run","Install piscosour dependency");
        this.sh("npm install piscosour --save", reject,true);

        this.logger.info("#magenta","run","Copying files to node module");

        var origin = path.join(config.getDir("piscosour"),"templates","bin","pisco_");
        var dest = path.join(config.rootDir,"bin");
        var destFile = path.join(dest,"pisco.js");
        fsUtils.createDir(dest);

        return fsUtils.copyFileFiltered(origin, destFile, {resolve: resolve, reject: reject, logger: this.logger});
    },

    prove : function(resolve, reject){
        this.logger.info("#magenta","prove","Prove that the new pisco recipe is executable");
        var result = this.sh("node bin/pisco.js", reject);

        if (result.status !== 0) {
            this.logger.error("#red", "Error: commnad not executed propelly!", result.stderr.toString());
        }
    }

};

