/*jshint node:true */

'use strict';

var fileName = "piscosour.json",
    chalk = require('chalk'),
    path = require('path'),
    fs = require('fs'),
    logger = require('./logger'),
    pwd = process.cwd();
//Este es el directorio actual, cambia al ejecutar chdir

var mergeObject = function(orig, added){
    for (var name in orig) {
        if (added[name] && Object.prototype.toString.call( added[name] ) === '[object Object]') {
            added[name] = mergeObject(orig[name], added[name]);
        }else if (added[name] && Object.prototype.toString.call( added[name] ) === '[object Array]') {
            for (var i in orig[name]) {
                if (added[name].indexOf(orig[name][i])<0)
                    added[name].push(orig[name][i]);
            }
        }else {
            added[name] = orig[name];
        }
    }
    return added;
};

var getHome = function(){
    return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
};

var getModuleDir = function(){
    var objPath = path.parse(process.mainModule.filename);
    return objPath.dir.substring(0,objPath.dir.lastIndexOf('/'));
};

/**
 * Gets the module dir for docs location
 * @returns {string}
 */
var getModulesDir = function(){
    var modulesDir = {};

    var moduleDir = getModuleDir();

    var pkg = require(path.join(moduleDir,'package.json'));

    // (1) piscosour dir
    if (pkg.name!=='piscosour')
        modulesDir.piscosour = path.join(moduleDir,'node_modules','piscosour');

    // (2) Module dir
    modulesDir.module=moduleDir;

    // (3) User dir
    //modulesDir.user = path.join(getHome(),'.piscosour');

    // (4) Local dir 'c_' only configuration
    modulesDir.c_local = path.join(pwd,'.piscosour');

    modulesDir = setAllChildModules(modulesDir);

    return modulesDir;
};

var setAllChildModules = function(modulesDir){

    var file = path.join(modulesDir.module, 'recipes.json');

    if (fs.existsSync(file)) {
        var recipes = JSON.parse(fs.readFileSync(file));
        if (recipes.list)
            for (var i in recipes.list){
                var name = recipes.list[i];
                modulesDir[name] = path.join(modulesDir.module,'node_modules',name);
            }
    }

    return modulesDir;
};

var safeRequire = function(path, warnings){
    var obj = {};
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

    var config = {
        modulesDir : getModulesDir(),
        warnings : [],
        merge : mergeObject
    };

    var addShot = function(dir,type,shot,shots){
        logger.trace("reading shot:", "#cyan", shot,"for type","#green",type);
        if (!shots[shot])
            shots[shot] = {};
        if (!shots[shot][type])
            shots[shot][type] = {};
        shots[shot][type].params = safeRequire(path.join(dir,'shots',shot,type,'params.json'));
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
            for (var i in configAdded.repoTypes) {
                addShot(dir,configAdded.repoTypes[i],shot,configAdded.shots);
            }
        }

        if (configAdded.straws)
            for (var straw in configAdded.straws) {
                logger.trace("reading straw:", "#green", straw);
                var strawConfig = safeRequire(path.join(dir,'straws',straw,'straw.json'));

                if (strawConfig.params)
                    configAdded.straws[straw].params = strawConfig.params;

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
    };

    config.getShotParams = function(normal){
        for (var shot in this.shots){
            if (shot===normal.name && this.shots[shot][normal.repoType]){
                return this.shots[shot][normal.repoType].params;
            }
        }
        return {};
    };

    config.getStrawParams = function(normalShot, normal){
        for (var straw in this.straws){
            if (straw===normal.name){
                for (var shot in this.straws[straw].shots){
                    if (shot===normalShot.name && this.straws[straw].shots[shot][normalShot.repoType]){
                        return this.straws[straw].shots[shot][normalShot.repoType].params;
                    }
                }
            }
        }
        return {};
    };

    return config;
};

// Execution on reading time in order to get config at de beginning

var config = getConfig();

logger.trace("#green","Effective config:",JSON.stringify(config));

module.exports = config;