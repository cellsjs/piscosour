'use strict';

const fs = require('fs');
const path = require('path');
const fsUtils = require('./utils/fsUtils');
const home = process.env.HOME ? process.env.HOME : process.env.HOMEPATH;
const file = path.join(home, '.piscosour', 'piscosour.json');
const uuid = require('uuid');

module.exports = {

  _write: function(config) {
    fs.writeFileSync(file, JSON.stringify(config, null, 2));
  },
  _read: function() {
    if (!fsUtils.exists(file)) {
      fsUtils.createDir(path.join(home, '.piscosour'));
      return {
        analytics: {
          userok: {}
        }
      };
    } else {
      return fsUtils.readConfig(file);
    }
  },
  ok: function(name) {
    const config = this._read();
    config.analytics.uuid = uuid.v4();
    config.analytics.userok[name] = true;
    this._write(config);
  },
  ko: function(name) {
    const config = this._read();
    config.analytics.userok[name] = false;
    this._write(config);
  }
};