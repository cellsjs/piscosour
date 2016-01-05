/*jshint node:true */

'use strict';

var params = require('./slife-params'),
    logger = require('./slife-logger'),
    config = require('./slife-config'),
    fs = require('fs');

var i18n = function() {

    var roots = [];

    for (var name in config.modulesDir){
        roots.push(config.modulesDir[name] + '/locale/' + params.lang);
        roots.push(config.modulesDir[name] + '/locale/' + params.defaultLang);
    };

    /**
     * Read the locale message file in the path
     * @param path
     * @returns {*}
     */
    var messages = function(path) {
        logger.trace("#green","slife-i18n:messages:","path:",path);

        for (var i in roots) {
            var msg = safeRequire(path, roots[i]);
            if (msg) return msg;
        }

        return {};
    };

    var safeRequire = function(path, root){
        logger.trace("#green","slife-i18n:safeRequire:","path:",path,"root:", root);
        try {
            return require(root+path);
        }catch(e) {
            return;
        }
    };

    //TODO: Mejorar la lectura de ficheros para que salgan formateados, por ejemplo md...
    var readFileFrom = function(path, root){
        logger.trace("#green","slife-i18n:readFileFrom:","path:",path,"root:", root);
        try {
            return fs.readFileSync(root+path,'utf8');
        }catch(e) {
            return;
        }
    };

    var readFile = function(path){
        logger.trace("#green","slife-i18n:readFile:","path:",path);

        for (var i in roots) {
            var content = readFileFrom(path, roots[i]);
            if (content) return content;
        }

        var msg = messages("/messages.json");
        return config.moduleDir + '/locale/' + params.defaultLang + path +" - "+msg["notExists"];
    };

    return {
        messages : messages,
        readFile: readFile
    };

};

module.exports = i18n();