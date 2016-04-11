/*jshint node:true */

'use strict';

var path = require('path'),
    fs = require('fs'),
    logger = require('./logger'),
    fsUtils = require('./utils/fsUtils.js'),
    pwd = process.cwd();

var Chef = function(){


    var _getModuleDir = function(){
        var objPath = path.parse(process.mainModule.filename);
        var res = objPath.dir.substring(0,objPath.dir.lastIndexOf(path.sep));
        return res;
    };


    var getRecipes = function(){
        var rootDir = _getModuleDir();
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

/**
 * **Internal:**
 *
 * Read all piscosour.json files of every recipes imported in one module and prepare one json object with all the information.
 *
 * This module is used only in module **config.js**
 *
 * @returns {{getRecipes: getRecipes}}
 * @module Chef
 */
module.exports = Chef();