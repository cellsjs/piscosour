'use strict';

let path = require('path');
let config = require('./config');
let logger = require('./logger');
let fsUtil = require('./utils/fsUtils');

var context = {

  _inRoot: function(fileName, workingDir) {
    fileName = fileName.replace('/', path.sep);
    fileName = path.join(config.rootDir, workingDir, fileName);
    return fsUtil.exists(fileName) ? fileName : undefined;
  },
  cis: function(name, workingDir) {
    let ctx = config.params.contexts[name];

    if (!ctx) {
      return false;
    }
    /* eslint-disable guard-for-in */
    // return a boolean is necesary this way, with forEach doesn't work.
    for (let n in ctx) {
      let check = ctx[n];
      let file = context._inRoot(check.file, workingDir);

      if (check.noexists ? file : !file && !check.sufficient) {
        logger.trace('check file:', '#cyan', check.file, 'doesn\'t exists!');
        return false;
      }

      if (check.conditions && file) {
        let that = fsUtil.readConfig(file);

        for (let i in check.conditions) {
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
    var ami = [];
    config.repoTypes.forEach((type)=> {
      var cis = context.cis(type, workingDir);
      logger.trace('checking if your are in a ', type, ':', cis);
      if (cis) {
        ami.push(type);
      }
    });
    return ami;
  }
};

module.exports = context;