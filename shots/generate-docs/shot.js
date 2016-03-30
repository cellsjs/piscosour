'use strict';

var fs = require('fs'),
    path = require('path');

module.exports = {
    description : "Generate one file per straw inside a directory",

    run : function() {
        this.logger.info("#magenta", "run", "Merge all info.md into a big one per straw");
        var straws = fs.readdirSync(path.join(process.cwd(), 'straws'));

        straws.forEach((dir) => {
            this.logger.info("processing","#cyan", dir,"...");
            var straw = this.fsReadConfig(path.join(process.cwd(), 'straws',dir,'straw.json'));
            var bundle = [];

            for (var shotName in straw.shots){
                var shot = straw.shots[shotName];
                this.logger.info("#green","reading","shot","#cyan",shotName);

                for (var recipeName in this.config.recipes){
                    var recipe = this.config.recipes[recipeName];
                    if (recipe.name && recipe.shots[shotName]){
                        var recipeTitle = recipeName!=='module'?' (from '+recipeName+')':'';
                        var file = path.join(recipe.dir,"shots",shotName,"info.md");
                        bundle = this.runner.addBundle("#"+shotName+recipeTitle,file, bundle);

                        this.config.repoTypes.forEach((type) => {
                            file = path.join(recipe.dir,"shots",shotName,type,"info.md");
                            bundle = this.runner.addBundle("#"+shotName+recipeTitle+"\n(only for "+type+")",file, bundle);
                        });
                    }
                }
            }
            this.fsCreateDir('doc');
            this.fsCreateDir('doc/straws');
            this.fsBundleFiles(bundle,"doc/straws/"+dir+".md");
        });
    },

    addBundle : function(title, file, bundle){
        if (this.fsExists(file)) {
            bundle.push({
                title: title,
                file: file
            });
        }
        return bundle;
    }
};