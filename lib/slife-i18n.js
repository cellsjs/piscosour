/*jshint node:true */

'use strict';

var params = require('./slife-params'),
    logger = require('./slife-logger'),
    config = require('./slife-config'),
    fs = require('fs');

var i18n = function() {

    /**
     * Read the locale message file in the path
     * @param path
     * @returns {*}
     */
    var messages = function(path) {
        logger.trace("#green","slife-i18n:messages:","path:",path);
        try {
            return require('../locale/' + params.lang + path);
        }catch(e){
            return require('../locale/' + params.defaultLang + path);
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
        var roots = [
            config.moduleDir + '/locale/' + params.lang,
            config.moduleDir + '/locale/' + params.defaultLang
        ];

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