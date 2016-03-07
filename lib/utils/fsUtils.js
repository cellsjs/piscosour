'use strict';

var fs = require('fs'),
    path = require('path');

var util = {
    createDir : function (dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    },

    copyDirFiltered : function (origin, dest, options){
        options.logger.info("#yellow","copy", origin, "to", dest);
        var files = fs.readdirSync(origin);
        var z = files.length;
        var n = 0;
        for (var i in files){
            var file = files[i];
            var read = fs.createReadStream(path.join(origin,file));
            var write = fs.createWriteStream(path.join(dest,file));
            read.pipe(write);
        }
        write.on('error', function(error){
            options.reject(error);
        });

        write.on('finish', function(){
            options.resolve();
        });

        return true;
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

    copyFileFiltered : function (origin, dest, options){
        options.logger.info("#yellow","copy", origin, "to", dest);
        var read = fs.createReadStream(origin);
        var write = fs.createWriteStream(dest);
        read.pipe(write);
        write.on('error', function(error){
            options.reject(error);
        });

        write.on('finish', function(){
            options.resolve();
        });
        return true;
    },

    //TODO: Cambiar todos los rm -rf
    rmrfDir : function(dir) {
        if (!fs.existsSync(dir)) {
        }
    },

    readConfig : function(file){
        var local = {empty:true};
        if (fs.existsSync(file))
            local = JSON.parse(fs.readFileSync(file));

        return local;
    }

}

module.exports = util;