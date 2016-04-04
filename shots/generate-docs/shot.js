'use strict';

var fs = require('fs'),
    path = require('path');

module.exports = {
    description : "Generate one file per straw inside a directory",

    run : function() {
        this.logger.info("#magenta", "run", "Merge all info.md of straws and shots in the readme.md");

        var bundle = [];

        bundle = this.runner._addBundle(this.runner._infoRecipe(), null, bundle);
        bundle = this.runner._addBundle("#Commands", null, bundle);
        this.runner._infoStraws(bundle);
        bundle = this.runner._addBundle("\n#Plugins", null, bundle);
        this.runner._infoPlugins(bundle);

        this.fsAppendBundle(bundle,"README.md", "Recipes");
    },

    _infoRecipe : function(){
        var content = "|Name|Version|Description|\n";
        content += "|---|---|---|\n";
        for (var recipeName in this.config.recipes) {
            var recipe = this.config.recipes[recipeName];
            if (recipe.name) {
                content += "|"+recipe.name+"|"+recipe.version+"|"+recipe.description+"|\n";
            }
        }
        return content;
    },

    _infoPlugins : function(bundle){
        try {
            var plugins = fs.readdirSync(path.join(process.cwd(), 'plugins'));

            plugins.forEach((dir) => {
                this.logger.info("processing plugin","#cyan", dir,"...");
                var fileMd = path.join(process.cwd(), 'plugins', dir, 'info.md');
                var file = path.join(process.cwd(), 'plugins', dir, 'plugin.js');
                bundle = this.runner._addBundle("##" + dir + ": \"" + require(file).description + "\"", fileMd, bundle, true);
            });
        }catch(e){
            bundle = this.runner._addBundle("There is no plugin for this recipe", null, bundle);
        }
    },

    _infoStraws : function(bundle){
        var straws = fs.readdirSync(path.join(process.cwd(), 'straws'));

        straws.forEach((dir) => {
            this.logger.info("processing straw","#cyan", dir,"...");
            var straw = this.fsReadConfig(path.join(process.cwd(), 'straws',dir,'straw.json'));
            if (straw.type==='normal')
                this.runner._infoStraw(bundle,straw,dir);
        });
    },

    _infoStraw : function(bundle, straw, dir, p){
        var file = path.join(process.cwd(), 'straws', dir, 'info.md');
        bundle = this.runner._addBundle("##" + dir + ": \"" + straw.name + "\"", file, bundle, true, straw.description);

        var n = 1;
        for (var shotName in straw.shots) {
            var shot = straw.shots[shotName];
            this.logger.info("#green", "reading", "shot", "#cyan", shotName);
            shotName = shotName.indexOf(':')>=0?shotName.split(':')[0]:shotName;
            if (shot.type==='straw'){
                var strawShot = this.fsReadConfig(path.join(process.cwd(), 'straws',shotName,'straw.json'));
                this.runner._infoStraw(bundle,strawShot,"#"+n+". (Straw) "+shotName, n);
                n++;
            }else {
                for (var recipeName in this.config.recipes) {
                    var recipe = this.config.recipes[recipeName];
                    if (recipe.name && recipe.shots[shotName]) {
                        file = path.join(recipe.dir, "shots", shotName, "info.md");
                        var info = this.config.getShotInfo(shotName);
                        bundle = this.runner._addBundle("\n###" + n +(p?'.'+p:'')+ ". " + shotName + ": \"" + info.description + "\"", file, bundle, true, this.runner._infomd(info));
                        n++;

                        this.config.repoTypes.forEach((type) => {
                            file = path.join(recipe.dir, "shots", shotName, type, "info.md");
                            bundle = this.runner._addBundle("\n#### For type " + type + ":", file, bundle);
                        });
                    }
                }
            }
        }
    },

    _infomd : function(info){
        var r = "```\n";
        r += "Repository types:";
        info.types.forEach((type,i,a) =>{
            r += "  "+type;
            if (i<a.length-1) r += ",";
        });
        r += "\nRecipes:";
        info.recipes.forEach((recipe,i,a) =>{
            r += " "+recipe.name+" ("+recipe.version+")";
            if (i<a.length-1) r += "\n              ";
        });
        r += "\n```";
        return r;
    },

    _addBundle : function(title,file, bundle, force, subtitle){
        if (!file || this.fsExists(file) || force) {
            bundle.push({
                title: title,
                subtitle: subtitle,
                file: file
            });
        }
        return bundle;
    }
};