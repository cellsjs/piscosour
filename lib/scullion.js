/*jshint node:true */

'use strict';

var fileName = "piscosour.json",
    path = require('path'),
    logger = require('./logger'),
    fs = require('fs'),
    fsUtils = require('./utils/fsUtils.js'),
    pwd = process.cwd();

var serveConfig = function(obj, target ,file){
    if (obj===undefined) obj = {};
    var config = fsUtils.readConfig(file);
    if (!config.empty) {
        logger.trace("reading:","#green",file);
        obj[target] = config;
    }
    return obj;
};

var serveShots = function(recipe){

    if (fsUtils.exists(path.join(recipe.dir,'shots'))) {

        var shotDirs = fs.readdirSync(path.join(recipe.dir, 'shots'));

        if (shotDirs.length>0) {
            for (var i in shotDirs) {
                var shotDir = shotDirs[i];
                if (!recipe.shots) recipe.shots = {};
                recipe.shots[shotDir] = serveConfig(recipe.shots[shotDir],'default',path.join(recipe.dir, 'shots', shotDir, 'params.json'));
                var typeDirs = fs.readdirSync(path.join(recipe.dir, 'shots', shotDir));
                for (var j in typeDirs) {
                    var typeDir = typeDirs[j];
                    recipe.shots[shotDir] = serveConfig(recipe.shots[shotDir],typeDir, path.join(recipe.dir, 'shots', shotDir, typeDir, 'params.json'));
                }
            }
        }

    }
    return recipe;
};

var serveStraws = function(recipe){
    if (fsUtils.exists(path.join(recipe.dir,'straws'))) {

        var strawDirs = fs.readdirSync(path.join(recipe.dir, 'straws'));

        if (strawDirs.length>0) {
            for (var i in strawDirs) {
                var strawDir = strawDirs[i];
                recipe.straws = serveConfig(recipe.straws,strawDir, path.join(recipe.dir, 'straws', strawDir, 'straw.json'));
            }
        }
    }
    return recipe;
};

var cook = function(recipes) {
    logger.trace("#magenta","Scullion is cooking all recipes");
    for (var name in recipes) {
        var recipe = recipes[name];
        logger.trace("cooking:","#green",recipe.name?recipe.name:name,"dir:",recipe.dir);

        recipe = serveConfig(recipe,'config', path.join(recipe.dir,fileName));

        if (recipe.name) {
            recipe = serveShots(recipe);
            recipe = serveStraws(recipe);
        }
    }

    return {
        recipes : recipes,
        rootDir : pwd
    };
};

module.exports = {cook: cook};