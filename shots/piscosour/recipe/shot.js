'use strict';

var fs = require('fs'),
    path = require('path');

module.exports = {

    whenDefaultType:  function(answer){
        return answer.doDefault;
    },

    config: function(go, stop){
        this.logger.info("#magenta","config","Configure recipe", this.piscoFile);
        var configLocal = this.fsReadConfig(this.piscoFile);

        if (this.params.defaultType) {

            if (!configLocal.repoTypes)
                configLocal.repoTypes = [];

            if (configLocal.repoTypes.indexOf(this.params.defaultType) < 0) {
                configLocal.repoTypes.push(this.params.defaultType);
            }

            configLocal.defaultType = this.params.defaultType;

            fs.writeFileSync(this.piscoFile, JSON.stringify(configLocal, null, 4));
        }

        var fixDeprecated = function(){
            for (var name in configLocal.straws){
                var local = configLocal.straws[name];
                var strawFile = path.join(this.config.rootDir,"straws",name,"straw.json");
                var straw = this.fsReadConfig(strawFile);
                straw.type =local.type;
                straw.name = local.name;
                straw.description = local.description;
                fs.writeFileSync(strawFile,JSON.stringify(straw,null,4));
            }
            delete configLocal.straws;
            fs.writeFileSync(this.piscoFile,JSON.stringify(configLocal,null,4));
            this.logger.info("#green","piscosour.json fixed!");
            go();
        };

        if (configLocal.straws){
            this.inquire("promptsPisco").then(fixDeprecated);
            return true;
        };
    }
};