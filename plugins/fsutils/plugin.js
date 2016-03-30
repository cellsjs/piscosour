'use strict';

var fs = require('fs'),
    fsUtils = require('../../lib/utils/fsUtils'),
    path = require('path');

module.exports = {
    description : "fs utils",

    addons : {
        fsCreateDir : fsUtils.createDir,
        fsExists : fsUtils.exists,
        fsReadConfig : fsUtils.readConfig,

        fsCopyDirFiltered : function (origin, dest){
            this.logger.info("#yellow","copy", origin, "to", dest);
            var files = fs.readdirSync(origin);
            var z = files.length;
            var n = 0;
            for (var i in files){
                var file = files[i];
                var read = fs.createReadStream(path.join(origin,file));
                var write = fs.createWriteStream(path.join(dest,file));
                read.pipe(write);
            }
            return new Promise(function (resolve, reject){
                write.on('error', function(error){
                    reject(error);
                });

                write.on('finish', function(){
                    resolve();
                });
            });
        },

        fsCopyFileFiltered : function (origin, dest){
            this.logger.info("#yellow","copy", origin, "to", dest);
            var read = fs.createReadStream(origin);
            var write = fs.createWriteStream(dest);
            read.pipe(write);
            return new Promise(function (resolve, reject) {
                write.on('error', function (error) {
                    reject(error);
                });

                write.on('finish', function () {
                    resolve();
                });
            });
        },

        fsBundleFiles : function(bundle, file){
            this.logger.trace("Bundle ", file, bundle);
        }
    }
};
