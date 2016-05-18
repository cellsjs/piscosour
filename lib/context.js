'use strict';

const path = require('path');
const config = require('./config');
const logger = require('./logger');
const fsUtil = require('./utils/fsUtils');

const context = {

  _inRoot: function(fileName, workingDir) {
    fileName = fileName.replace('/', path.sep);
    fileName = path.join(config.rootDir, workingDir, fileName);
    return fsUtil.exists(fileName) ? fileName : undefined;
  },
  cis: function(name, workingDir) {
    const ctx = config.params.contexts[name];

    if (!ctx) {
      return false;
    }
    /* eslint-disable guard-for-in */
    // return a boolean is necesary this way, with forEach doesn't work.
    for (const n in ctx) {
      const check = ctx[n];
      const file = context._inRoot(check.file, workingDir);

      if (check.noexists ? file : !file && !check.sufficient) {
        logger.trace('check file:', '#cyan', check.file, 'doesn\'t exists!');
        return false;
      }

      if (check.conditions && file) {
        const that = fsUtil.readConfig(file);

        for (const i in check.conditions) {
          let res;
          try {
            res = eval(check.conditions[i], that);
          } catch (e) {
            logger.warn('#yellow', 'There is a problem on a condition of context - ', '(', check.conditions[i], ')', e);
          }
          if (res && check.sufficient) {
            logger.trace('check file:', '#cyan', check.file, 'sufficient: ', check.conditions[i], true);
            return true;
          } else if (!res && !check.sufficient) {
            logger.trace('check file:', '#cyan', check.file, check.conditions[i], false);
            return false;
          }
        }
      }
    }
    /* eslint-enable guard-for-in */

    return true;
  },
  whoami: function(workingDir) {
    const ami = [];
    config.repoTypes.forEach((type)=> {
      const cis = context.cis(type, workingDir);
      logger.trace('checking if your are in a ', type, ':', cis);
      if (cis) {
        ami.push(type);
      }
    });
    return ami;
  }
};

module.exports = context;