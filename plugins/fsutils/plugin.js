'use strict';

let fs = require('fs');
let fsUtils = require('../../lib/utils/fsUtils');
let path = require('path');

module.exports = {
  description: 'fs utils',

  addons: {
    fsCreateDir: fsUtils.createDir,
    fsExists: fsUtils.exists,
    fsReadConfig: fsUtils.readConfig,
    fsReadFile: fsUtils.readFile,

    fsCopyDirFiltered: function(origin, dest) {
      this.logger.info('#yellow', 'copy', origin, 'to', dest);
      var files = fs.readdirSync(origin);
      var z = files.length;
      var n = 0;
      var write;
      files.forEach((file) => {
        var read = fs.createReadStream(path.join(origin, file));
        write = fs.createWriteStream(path.join(dest, file));
        read.pipe(write);
      });
      return new Promise(function(resolve, reject) {
        write.on('error', function(error) {
          reject(error);
        });

        write.on('finish', function() {
          resolve();
        });
      });
    },

    fsCopyFileFiltered: function(origin, dest) {
      this.logger.info('#yellow', 'copy', origin, 'to', dest);
      var read = fs.createReadStream(origin);
      var write = fs.createWriteStream(dest);
      read.pipe(write);
      return new Promise(function(resolve, reject) {
        write.on('error', function(error) {
          reject(error);
        });

        write.on('finish', function() {
          resolve();
        });
      });
    },

    fsAppendBundle: function(bundle, file, title) {
      var orig = this.fsReadFile(file).toString();
      var z = orig.indexOf('#' + title);
      var content = z >= 0 ? orig.toString().substring(0, z - 1) : orig;
      content += '\n#' + title + '\n';
      bundle.forEach((item) => {
        content += '\n' + item.title + '\n';
        if (item.subtitle) {
          content += item.subtitle + '\n';
        } else {
          content += '\n';
        }

        if (item.file) {
          content += this.fsReadFile(item.file);
        }
      });
      fs.writeFileSync(file, content);
    }
  }
};