/*jshint node:true */

'use strict';

var fileName = "piscosour.json",
    chalk = require('chalk'),
    path = require('path'),
    fs = require('fs'),
    logger = require('./logger'),
    fsUtils = require('./utils/fsUtils.js'),
    pwd = process.cwd();

var mergeObject = function(orig, added){
    if (orig===undefined) orig = {};
    if (added===undefined) added = {};
    else added = JSON.parse(JSON.stringify(added));
    for (var name in orig) {
        if (added[name] && Object.prototype.toString.call( added[name] ) === '[object Object]') {
            added[name] = mergeObject(orig[name], added[name]);
        }else if (added[name] && Object.prototype.toString.call( added[name] ) === '[object Array]') {
            for (var i in orig[name]) {
                if (added[name].indexOf(orig[name][i])<0 && Object.prototype.toString.call(orig[name][i]) !== '[object Object]')
                    added[name].push(orig[name][i]);
            }
        }else {
            if (!added[name]) {
                added[name] = orig[name];
            }
        }
    }
    return added;
};

var getModuleDir = function(){
    var objPath = path.parse(process.mainModule.filename);
    var res = objPath.dir.substring(0,objPath.dir.lastIndexOf('/'));
    return res;
};

var getPiscosourDir = function(){
    for (var i in process.mainModule.paths){
        var tmp = process.mainModule.paths[i];
        if (fs.existsSync(tmp) && fs.existsSync(path.join(tmp,"piscosour")))
            return path.join(tmp,"piscosour");
    }
};

/**
 * Gets the module dir for docs location
 * @returns {string}
 */
var getModulesDir = function(){
    var modulesDir = {};

    var moduleDir = getModuleDir();
    var recipes = getRecipes(moduleDir);

    var pkg = require(path.join(moduleDir,'package.json'));

    // (1) piscosour dir
    if (pkg.name!=='piscosour')
        modulesDir.piscosour = getPiscosourDir();
    else
        modulesDir.piscosour = moduleDir;

    // (2) All piscosour recipes
    modulesDir = setRecipesDir(moduleDir,modulesDir, recipes);

    // (3) Module dir
    modulesDir.module=moduleDir;

    // (4) Local dir 'c_' only configuration
    modulesDir.c_local = path.join(pwd,'.piscosour');

    return {
        modulesDir: modulesDir,
        recipes: recipes
    };
};

var getRecipes = function(rootDir){

    var file = path.join(rootDir, 'package.json');
    var recipes = [];

    if (fs.existsSync(file)) {
        var pkg = fsUtils.readConfig(file);
        if (pkg.dependencies)
            for (var name in pkg.dependencies){
                var moduleFile = path.join(rootDir,'node_modules',name,'package.json');
                var pkgModule = fsUtils.readConfig(path.join(moduleFile));
                if (!pkgModule)
                    logger.error("#red",moduleFile,"doesn't exists!");
                else if (pkgModule.keywords && pkgModule.keywords.indexOf("piscosour-recipe")>=0){
                    logger.trace(name,"is a piscosour recipe --> ", pkgModule.version);
                    recipes.push({
                        name:name,
                        version: pkgModule.version,
                        description: pkgModule.description
                    });
                }
            }
    }

    return recipes;
};

var setRecipesDir = function(rootDir, modulesDir, recipes){
    for (var i in recipes){
        var name = recipes[i].name;
        modulesDir[name] = path.join(rootDir,'node_modules',name);
    }
    return modulesDir;
};

var safeRequire = function(path, warnings){
    var obj = {empty:true};
    try {
        obj = require(path);
    }catch(e){
        var warning = chalk.yellow("WARNING")+": File '"+chalk.cyan(path)+"' not found: Using default...";
        if (warnings)
            warnings.push(warning);
    }
    return obj;
};

var getConfig = function() {

    var lists = getModulesDir();

    var config = {
        recipes : lists.recipes,
        modulesDir : lists.modulesDir,
        warnings : [],
        merge : mergeObject,
        rootDir : pwd
    };

    var addShot = function(dir,type,shot,shots){
        logger.trace("reading shot:", "#cyan", shot,"for type","#green",type);
        var params = safeRequire(path.join(dir,'shots',shot,type,'params.json'));
        if (!params.empty){

            if (!shots[shot])
                shots[shot] = {};

            if (params.isTest){
                shots[shot].isTest = true;
            }

            if (!shots[shot][type])
                shots[shot][type] = {};

            shots[shot][type].params = mergeObject(params, shots[shot][type].params);

        }
    };

    for (var name in config.modulesDir) {
        var dir = config.modulesDir[name];
        var shots = [];
        if (fs.existsSync(path.join(dir,'shots'))) {
            shots = fs.readdirSync(path.join(dir, 'shots'));
        }
        logger.trace("trying:", "#green", name,"-> dir:",dir);

        var configAdded = safeRequire(path.join(dir,fileName), config.warnings);

        if (!configAdded.shots)
            configAdded.shots = {};

        for (var i in shots){
            var shot = shots[i];
            var repotypes = config.repoTypes?configAdded.repoTypes.concat(config.repoTypes):configAdded.repoTypes;
            for (var i in repotypes) {
                addShot(dir,repotypes[i],shot,configAdded.shots);
            }
        }

        if (configAdded.straws)
            for (var straw in configAdded.straws) {
                logger.trace("reading straw:", "#green", straw);
                var strawConfig = safeRequire(path.join(dir,'straws',straw,'straw.json'));

                if (strawConfig.params)
                    configAdded.straws[straw].params = mergeObject(configAdded.straws[straw].params,strawConfig.params);

                if (strawConfig.shots)
                    configAdded.straws[straw].shots = strawConfig.shots;

                if (configAdded.straws[straw].shots)
                    for (var shot in configAdded.straws[straw].shots) {
                        for (var i in configAdded.repoTypes) {
                            addShot(dir,configAdded.repoTypes[i],shot,configAdded.straws[straw].shots);
                        }
                    }
            }

        config = mergeObject(config,configAdded);
    }

    config.getShotParams = function(normal){
        for (var shot in this.shots){
            if (shot===normal.name && this.shots[shot][normal.repoType]){
                var params = mergeObject(this.params,this.shots[shot].params);
                params = mergeObject(params, this.shots[shot][normal.repoType].params);
                return params;
            }
        }
        return {};
    };

    config.getStrawParams = function(normalShot, normal){
        for (var straw in this.straws){
            if (straw===normal.name){
                for (var shot in this.straws[straw].shots){
                    if (shot===normalShot.name){
                        var params = mergeObject(this.params, this.straws[straw].params);
                        params = mergeObject(params,this.straws[straw].shots[shot].params);
                        if (this.straws[straw].shots[shot][normalShot.repoType])
                            params = mergeObject(params, this.straws[straw].shots[shot][normalShot.repoType].params);
                        return params;
                    }
                }
            }
        }
        return {};
    };

    return config;
};

// Execution on reading time in order to get config at the beginning

var config = getConfig();

logger.trace("#green","Effective config:",JSON.stringify(config));

module.exports = config;