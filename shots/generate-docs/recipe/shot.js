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
            if (straw.type==='normal')
                this.runner._infoStraw(bundle,straw,dir);
        });

        this.fsAppendBundle(bundle,"README.md", "Commands of Recipe");
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