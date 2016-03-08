'use strict';

var piscosour = require('../..'),
    path = require('path'),
    fs = require('fs'),
    config = piscosour.config,
    fsUtils = piscosour.fsUtils,
    Shot = piscosour.Shot;

var shot = new Shot({
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
        if (!shot.runner.params.doStraw)
            go({skip:true});
    },

    config : function(resolve){
        shot.logger.info("#magenta", "config", "Configuring straw", shot.runner.params.strawKey);
        var dir = path.join(config.rootDir, "straws", shot.runner.params.strawKey);

        fsUtils.createDir(path.join(config.rootDir, "straws"));
        fsUtils.createDir(path.join(config.rootDir, "straws",shot.runner.params.strawKey));

        var file = path.join(config.rootDir, "straws", shot.runner.params.strawKey,"straw.json");

        shot.runner.straw = fsUtils.readConfig(file, true);
        if (!shot.runner.straw.shots) {
            shot.runner.straw.shots = {};
            shot.inquire("promptsStraw").then(resolve);
            return true;
        }
    },

    run : function(){
        shot.logger.info("#magenta", "run", "Creating/managing straw", shot.runner.params.strawKey);

        if (shot.runner.params.strawName) {
            shot.runner.straw.name = shot.runner.params.strawName;
            shot.runner.straw.description = shot.runner.params.strawDescription;
            shot.runner.straw.type = shot.runner.params.strawType;
        }

        var shotName = shot.get("shotName", "shots");
        if (shotName) {
            shot.logger.info("#magenta", "Adding", shotName, "to", shot.runner.params.strawKey);
            shot.runner.straw.shots[shotName]={};
        }

        var file = path.join(config.rootDir, "straws", shot.runner.params.strawKey,"straw.json");
        fs.writeFileSync(file, JSON.stringify(shot.runner.straw, null, 4));
    },

    prove : function(resolve, reject){
        shot.logger.info("#magenta","prove","Prove that the straw is propelly executed");
        var repoType = shot.get("repoType", "shots");
        if (repoType) {
            var result = shot.sh("node bin/pisco.js " + repoType + ":" + shot.runner.params.strawKey, reject, true);

            if (result.status !== 0) {
                shot.logger.error("#red", "Error: straw not propelly created!");
                reject(result);
            }
        }
    }

});

module.exports = shot;