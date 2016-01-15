/*jshint node:true */

'use strict';

var fileName = "piscosour.json",
    chalk = require('chalk'),
    fs = require('fs'),
    logger = require('./logger'),
    pwd = process.env.PWD;
//Este es el directorio actual, cambia al ejecutar chdir
//pwd = process.cwd()

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
    var filename = __dirname;
    return filename.substring(0,filename.lastIndexOf('/'));
};

/**
 * Gets the module dir for docs location
 * @returns {string}
 */
var getModulesDir = function(){
    var modulesDir = {};

    var moduleDir = getModuleDir();

    var pkg = require(moduleDir+'/package.json');

    // (1) piscosour dir
    if (pkg.name!=='piscosour')
        modulesDir.piscosour = moduleDir+'/node_modules/piscosour';

    // (2) Module dir
    modulesDir.module=moduleDir;

    // (3) User dir
    modulesDir.user = getHome()+'/.piscosour';

    // (4) Local dir
    modulesDir.local = pwd+'/.piscosour';

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

    for (var name in config.modulesDir) {
        var dir = config.modulesDir[name];
        logger.trace("trying:", "#green", name,"-> dir:",dir);

        var configAdded = safeRequire(dir+'/'+fileName, config.warnings);

        /**
         * Introduccir la configuración de los shots normales e inyectarlo en un shot cuando se arranca
         */
        if (configAdded.straws)
            for (var straw in configAdded.straws) {
                logger.trace("reading straw:", "#green", straw);
                var strawConfig = safeRequire(dir+'/straws/' + straw + '/straw.json');
                configAdded.straws[straw].params = strawConfig.params;
                configAdded.straws[straw].shots = strawConfig.shots;
                if (configAdded.straws[straw].shots)
                    for (var shot in configAdded.straws[straw].shots) {
                        for (var i in configAdded.repoTypes) {
                            var type = configAdded.repoTypes[i];
                            logger.trace("reading shot:", "#cyan", shot,"for type","#green",type);
                            if (!configAdded.straws[straw].shots[shot][type])
                                configAdded.straws[straw].shots[shot][type] = {};
                            configAdded.straws[straw].shots[shot][type].params = safeRequire(dir + '/shots/' + shot + "/" + type + '/params.json');
                        }
                    }
            }

        config = mergeObject(config,configAdded);
    }

    return config;
};

// Execution on reading time in order to get config at de beginning

var config = getConfig();

logger.trace("#green","Effective config:",JSON.stringify(config));

module.exports = config;