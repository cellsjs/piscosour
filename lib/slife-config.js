/*jshint node:true */

'use strict';

var fileName = "shortlife.json",
    chalk = require('chalk'),
    logger = require('./slife-logger'),
    config = require('../config/'+fileName),
    pwd = process.env.PWD;

var mergeObject = function(orig, added){
    for (var name in orig) {
        if (added[name]) {
            if (typeof orig[name] === 'object') {
                mergeObject(orig[name], added[name]);
            } else orig[name] = added[name];
        }
    }
};

/**
 * Gets the module dir for docs location
 * @returns {string}
 */
var getModuleDir = function(){
    var filename = process.mainModule.filename
    return filename.substring(0,filename.lastIndexOf('/'));
};

var setConfig = function() {
    //TODO: varias fuentes de configuración, obtener de módulos npm y de .shortlife en local

    config.moduleDir = getModuleDir();

    for (var dir in config.pipelines) {
        logger.trace("reading pipeline:", "#green", dir);
        var pipelineConfig = require('../pipelines/' + dir + '/pipeline.json');
        config.pipelines[dir].params = pipelineConfig.params;
        config.pipelines[dir].steps = pipelineConfig.steps;
        for (var step in config.pipelines[dir].steps) {
            logger.trace("reading step:", "#cyan", step);
            config.pipelines[dir].steps[step].params = require('../steps/' + step + '/params.json');
        }
    }
};

try {
    setConfig();
    var configLocal = require(pwd+'/'+fileName);
    mergeObject(config,configLocal);
}catch(e){
    config.warnings = chalk.yellow("WARNING")+": File '"+chalk.cyan(fileName)+"' not found: Using default...";
    logger.trace(config.warnings);
}

logger.trace("#green","Effective config:",JSON.stringify(config));

module.exports = config;