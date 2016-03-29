'use strict';

var piscosour = require('../..'),
    path = require('path'),
    fs = require('fs'),
    config = piscosour.config;

module.exports = {
    description : "Adding shot to a straw",

    straw : {},

    whenStrawKey : function(answer){
        return answer.doStraw;
    },

    strawTypes : function(){
        return [
            "normal",
            "internal",
            "util"
        ];
    },

    check: function(go){
        if (!this.params.doStraw)
            go({skip:true});
    },

    config : function(resolve){
        this.logger.info("#magenta", "config", "Configuring straw", this.params.strawKey);
        var dir = path.join(config.rootDir, "straws", this.params.strawKey);

        this.fsCreateDir(path.join(config.rootDir, "straws"));
        this.fsCreateDir(path.join(config.rootDir, "straws",this.params.strawKey));

        var file = path.join(config.rootDir, "straws", this.params.strawKey,"straw.json");

        this.runner.straw = this.fsReadConfig(file, true);
        if (!this.runner.straw.shots) {
            this.runner.straw.shots = {};
            this.inquire("promptsStraw").then(resolve);
            return true;
        }
    },

    run : function(){
        this.logger.info("#magenta", "run", "Creating/managing straw", this.params.strawKey);

        if (this.params.strawName) {
            this.runner.straw.name = this.params.strawName;
            this.runner.straw.description = this.params.strawDescription;
            this.runner.straw.type = this.params.strawType;
        }

        var shotName = this.get("shotName", "shots");
        if (shotName) {
            this.logger.info("#magenta", "Adding", shotName, "to", this.params.strawKey);
            this.runner.straw.shots[shotName]={};
        }

        var file = path.join(config.rootDir, "straws", this.params.strawKey,"straw.json");
        fs.writeFileSync(file, JSON.stringify(this.runner.straw, null, 4));
    },

    prove : function(resolve, reject){
        this.logger.info("#magenta","prove","Prove that the straw is propelly executed");
        var repoType = this.get("repoType", "shots");
        if (repoType) {
            var result = this.sh("node bin/pisco.js " + repoType + ":" + this.params.strawKey, reject, true);

            if (result.status !== 0) {
                this.logger.error("#red", "Error: straw not propelly created!");
                reject(result);
            }
        }
    }

};