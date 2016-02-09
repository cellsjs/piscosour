'use strict';

var piscosour = require('../../..'),
    path = require('path'),
    fs = require('fs'),
    config = piscosour.config,
    fsUtils = piscosour.fsUtils,
    Shot = piscosour.Shot;

var shot = new Shot({
    description : "Adding shot to a straw",

    straw : {},

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

        shot.runner.straw = fsUtils.readConfig(file);
        if (!shot.runner.straw.shots) {
            shot.runner.straw.shots = {};
            return shot.inquire("promptsStraw",resolve);
        }
    },

    run : function(){
        shot.logger.info("#magenta", "run", "Creating/managing straw", shot.runner.params.strawKey);

        if (shot.runner.params.strawName)
            shot.runner.createStraw();

        var file = path.join(config.rootDir, "straws", shot.runner.params.strawKey,"straw.json");

        var shotName = shot.get("shotName", "shots");
        if (shotName) {
            shot.logger.info("#magenta", "Adding", shotName, "to", shot.runner.params.strawKey);
            shot.runner.straw.shots[shotName]={};
            fs.writeFileSync(file, JSON.stringify(shot.runner.straw));
        }
    },

    prove : function(resolve, reject){
        shot.logger.info("#magenta","prove","Prove that the straw is propelly executed");
        var repoType = shot.get("repoType", "shots");
        if (repoType) {
            var result = shot.sh("node bin/pisco.js " + repoType + ":" + shot.runner.params.strawKey, reject);

            if (result.status !== 0) {
                shot.logger.error("#red", "Error: straw not propelly created!");
            }
        }
    },

    createStraw : function(){
        shot.logger.info("#magenta", "createStraw", "Creating new straw","#green" ,shot.runner.params.strawName);
        var file = path.join(config.rootDir,"piscosour.json");
        var piscosour = fsUtils.readConfig(file);
        if (!piscosour.straws[shot.runner.params.strawKey]) {
            piscosour.straws[shot.runner.params.strawKey] = {
                name: shot.runner.params.strawName,
                description : shot.runner.params.strawDescription,
                type: shot.runner.params.strawType
            };
            fs.writeFileSync(file, JSON.stringify(piscosour));
        }
    }

});

module.exports = shot;