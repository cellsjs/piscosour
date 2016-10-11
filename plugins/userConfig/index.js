'use strict';

const userConfig = require('../../lib/utils/userConfig');


module.exports = {
  addons: {
    userConfigRead: userConfig.read,
    userConfigWrite: userConfig.write,
    userConfigGet: userConfig.get,
    userConfigSet: userConfig.set
  }
};