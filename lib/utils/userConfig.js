'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');

const fsUtils = require('./fsUtils');

const piscosourDir = '.piscosour';
const piscosourJson = 'piscosour.json';
const home = process.env.HOME ? process.env.HOME : process.env.HOMEPATH;
const userConfigPath = path.join(home, piscosourDir, piscosourJson);

const read = () => fsUtils.readConfig(userConfigPath, true);

const write = (userConfig) => {
  if (!fsUtils.exists(userConfigPath)) {
    fsUtils.createDir(path.join(home, piscosourDir));
  }
  fs.writeFileSync(userConfigPath, JSON.stringify(userConfig, null, 2));
  return userConfig;
};

const get = (key) => _.get(read(), key, null);

const set = (key, value) => write(_.set(read(), key, value));

module.exports = {
  read: read,
  write: write,
  get: get,
  set: set
};