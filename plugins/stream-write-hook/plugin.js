'use strict';

const streamWriteHook = require('../../lib/utils/stream-write-hook');

module.exports = {
  addons: {
    streamWriteHook: streamWriteHook.hook,
    streamWriteUnhook: streamWriteHook.unhook
  }
};