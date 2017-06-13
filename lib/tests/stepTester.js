'use strict';

const path = require('path');
const logger = require('../logger');

const stepper = require('../stepper');
const context = require('../context');
const _ = require('lodash');

let config;

const getConfig = () => {
  return config ? config : require('../config').setOptions({isGlobal: false, isTest: true});
};

const tester = {
  setLoggerLevel(level){
    logger.setLevel(level);
  },
  loadStep(normal) {
    return getConfig().load(normal).step;
  },
  runStep(normal) {
    return new Promise((ok, ko) => {
      if (normal.baseDir) {
        getConfig().get().rootDir = path.resolve(normal.baseDir);
        process.chdir(getConfig().get().rootDir);
      }
      if (!normal.context) {
        normal.context = context.whoami(true);
      }
      logger.info('#green', 'contexts:', normal.context);
      normal.params = _.mapValues(getConfig().getStepParams(normal), (params, context) => _.merge(params, normal.params));
      stepper.execute(normal, ok, ko);
    });
  }
};

module.exports = tester;