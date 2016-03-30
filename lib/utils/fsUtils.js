'use strict';

var fs = require('fs'),
    path = require('path');

var util = {
    createDir : function (dir) {
        if (!util.exists(dir)) {
            fs.mkdirSync(dir);
        }
    },

    exists : function(filename){
        try {
            return fs.statSync(filename);
        }catch(e){
            if (e.syscall === 'stat') {
                return false;
            }else
                throw e;
        }
    },

    readConfig : function(file, realEmpty){
        var local = realEmpty?{}:{empty:true};
        if (util.exists(file))
            local = JSON.parse(fs.readFileSync(file));

        return local;
    }
};

module.exports = util;