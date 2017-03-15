'use strict';

const launcher = require('../../lib/utils/launcher');

module.exports = {
  addons: {
    sh: launcher.sh,
    sudo: launcher.sudo,
    executeSync: launcher.executeSync,
    _windowsPatch: launcher._windowsPatch,
    executeStreamed: launcher.executeStreamed,
    execute: launcher.execute,
    executeParallel: launcher.executeParallel,
    executeMassive: launcher.executeMassive
  }
};