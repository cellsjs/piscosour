'use strict';

let fs = require('fs');
let fsUtils = require('../../lib/utils/fsUtils');
let path = require('path');

module.exports = {

  addons: {
    fsCreateDir: fsUtils.createDir,
    fsExists: fsUtils.exists,
    fsReadConfig: fsUtils.readConfig,
    fsReadFile: fsUtils.readFile
  }
};
