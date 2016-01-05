/*jshint node:true */

'use strict';

var fileName = "shortlife.json",
    chalk = require('chalk'),
    logger = require('./slife-logger'),
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
    var pkg = require(moduleDir+'/package.json');

    // (1) Shortlife dir
    if (pkg.name!=='shortlife')
        modulesDir.shortlife = moduleDir+'/node_modules/shortlife';

    // (2) Module dir
    modulesDir.module=moduleDir;

    // (3) Local dir
    modulesDir.local = pwd+'/.shortlife';

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

        if (configAdded.pipelines)
            for (var pipeline in configAdded.pipelines) {
                logger.trace("reading pipeline:", "#green", pipeline);
                var pipelineConfig = safeRequire(dir+'/pipelines/' + pipeline + '/pipeline.json');
                configAdded.pipelines[pipeline].params = pipelineConfig.params;
                configAdded.pipelines[pipeline].steps = pipelineConfig.steps;
                if (configAdded.pipelines[pipeline].steps)
                    for (var step in configAdded.pipelines[pipeline].steps) {
                        logger.trace("reading step:", "#cyan", step);
                        configAdded.pipelines[pipeline].steps[step].params = safeRequire(dir+'/steps/' + step + '/params.json');
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