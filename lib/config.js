/*jshint node:true */

'use strict';

var fileName = "piscosour.json",
    chalk = require('chalk'),
    logger = require('./logger'),
    //TODO mirar process.cwd()
    pwd = process.env.PWD;

var mergeObject = function(orig, added){
    for (var name in orig) {
        if (added[name] && typeof orig[name] === 'object') {
            added[name] = mergeObject(orig[name], added[name]);
        }else {
            added[name] = orig[name];
        }
    }
    return added;
};

/**
 * Gets the module dir for docs location
 * @returns {string}
 */
var getModulesDir = function(){
    var modulesDir = {};

    var filename = process.mainModule.filename
    var moduleDir =filename.substring(0,filename.lastIndexOf('/'));
    moduleDir = moduleDir.substring(0,moduleDir.lastIndexOf('/'));
    //TODO mirar module.cwd()...
    var pkg = require(moduleDir+'/package.json');

    // (1) piscosour dir
    if (pkg.name!=='piscosour')
        modulesDir.piscosour = moduleDir+'/node_modules/piscosour';

    // (2) Module dir
    modulesDir.module=moduleDir;

    // (3) Local dir
    modulesDir.local = pwd+'/.piscosour';

    return modulesDir;
};

var safeRequire = function(path, warnings){
    var obj = {};
    try {
        obj = require(path);
    }catch(e){
        var warning = chalk.yellow("WARNING")+": File '"+chalk.cyan(path)+"' not found: Using default...";
        logger.trace(warning);
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