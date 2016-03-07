/*jshint node:true */

'use strict';

var path = require('path'),
    fs = require('fs'),
    logger = require('./logger'),
    fsUtils = require('./utils/fsUtils.js'),
    pwd = process.cwd();

var getMenu = function(){

    var getModuleDir = function(){
        var objPath = path.parse(process.mainModule.filename);
        var res = objPath.dir.substring(0,objPath.dir.lastIndexOf('/'));
        return res;
    };

    var getRecipes = function(){
        var rootDir = getModuleDir();
        var file = path.join(rootDir, 'package.json');
        logger.trace("Chef is reading all recipes from ","#magenta", file);
        var recipes = {
            configLocal : {
                dir: path.join(pwd, '.piscosour')
            }
        };

        if (fsUtils.exists(file)) {
            var pkg = fsUtils.readConfig(file);
            recipes.module = {
                name : pkg.name,
                version: pkg.version,
                description: pkg.description,
                dir: rootDir
            };
            if (pkg.dependencies)
                for (var name in pkg.dependencies){
                    var moduleFile = path.join(rootDir,'node_modules',name,'package.json');
                    var pkgModule = fsUtils.readConfig(path.join(moduleFile));
                    if (!pkgModule)
                        logger.error("#red",moduleFile,"doesn't exists!");
                    else if (pkgModule.keywords && pkgModule.keywords.indexOf("piscosour-recipe")>=0){
                        logger.trace(name,"- recipe detected! - version:", pkgModule.version);
                        recipes[name] = {
                            name : name,
                            version: pkgModule.version,
                            description: pkgModule.description,
                            dir: path.join(rootDir,'node_modules',name)
                        };
                    }
                }
        }

        return recipes;
    };

    return {
        getRecipes : getRecipes
    }
};

module.exports = getMenu();