/*jshint node:true */

'use strict';

var params = require('./slife-params'),
    logger = require('./slife-logger'),
    fs = require('fs');

var i18n = {

    /**
     * Read the locale message file in the path
     * @param path
     * @returns {*}
     */
    messages : function(path) {
        logger.trace("#green","slife-i18n:messages:","path:",path);
        try {
            return require('../locale/' + params.lang + path);
        }catch(e){
            return require('../locale/' + params.defaultLang + path);
        }
    },

    /**
     * Read any file inside de node module
     * @param path
     * @returns {*}
     */
    //TODO: Mejorar la lectura de ficheros para que salgan formateados, por ejemplo md...
    readFile : function(path){
        logger.trace("#green","slife-i18n:readFile:","path:",path);
        var filename = process.mainModule.filename
        var moduleDir = filename.substring(0,filename.lastIndexOf('/'));
        try {
            return fs.readFileSync(moduleDir+'/locale/'+params.lang+path,'utf8');
        }catch(e){
            try {
                return fs.readFileSync(moduleDir + '/locale/' + params.defaultLang + path, 'utf8');
            }catch(er){
                var messages = i18n.messages("/messages.json");
                return moduleDir + '/locale/' + params.defaultLang + path +" - "+messages["notExists"];
            }
        }
    }

};

module.exports = i18n;