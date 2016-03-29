'use strict';

var piscosour = require('../..'),
    path = require('path'),
    fsUtils = require('../../lib/utils/fsUtils'),
    root = process.cwd(),
    pkgFile = path.join(root,'package.json'),
    piscoFile = path.join(root,'piscosour.json'),
    pkg = fsUtils.readConfig(pkgFile);

module.exports = {
    description : "Utilities for recipes",

    check : function(){
        if (this.params.requireRecipe){
            if (!this.isRecipe())
                throw {error: "This is not a recipe!"};
            this.logger.info("This shot is on a recipe......","#green","OK");
        }
    },

    addons : {
        isRecipe : function (){
            return pkg && pkg.keywords && pkg.keywords.indexOf("piscosour-recipe")>=0;
        },
        pkg : pkg,
        pkgFile : pkgFile,
        piscoFile : piscoFile
    }
};