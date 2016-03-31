'use strict';

var fs = require('fs'),
    path = require('path');

module.exports = {
    description : "Generate one file per straw inside a directory",

    run : function() {
        this.logger.info("#magenta", "run", "Merge all info.md into a big one per straw");
        var straws = fs.readdirSync(path.join(process.cwd(), 'straws'));

        var bundle = [];

        straws.forEach((dir) => {
            this.logger.info("processing","#cyan", dir,"...");
            var straw = this.fsReadConfig(path.join(process.cwd(), 'straws',dir,'straw.json'));
            var file = path.join(process.cwd(), 'straws',dir,'info.md');
            bundle = this.runner.addBundle("#Command: ( "+dir+" ): "+straw.name,file, bundle, true, straw.description);

            var n = 1;
            for (var shotName in straw.shots){
                var shot = straw.shots[shotName];
                this.logger.info("#green","reading","shot","#cyan",shotName);

                for (var recipeName in this.config.recipes){
                    var recipe = this.config.recipes[recipeName];
                    if (recipe.name && recipe.shots[shotName]){
                        var recipeTitle = recipeName!=='module'?' (from '+recipeName+' v.'+recipe.version+')':'';
                        file = path.join(recipe.dir,"shots",shotName,"info.md");

                        bundle = this.runner.addBundle("\n##"+n+". "+shotName+recipeTitle,file, bundle, true);
                        n++;

                        this.config.repoTypes.forEach((type) => {
                            file = path.join(recipe.dir,"shots",shotName,type,"info.md");
                            bundle = this.runner.addBundle("\n##"+shotName+recipeTitle+"\n(only for "+type+")",file, bundle);
                        });
                    }
                }
            }
        });
        var filename = "README.md";
        if (this.fsExists(filename))
            filename = "pisco_README.md";
        this.fsBundleFiles(bundle,filename);
    },

    addBundle : function(title,file, bundle, force, subtitle){
        if (this.fsExists(file) || force) {
            bundle.push({
                title: title,
                subtitle: subtitle,
                file: file
            });
        }
        return bundle;
    }
};