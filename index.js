'use strict';

const moment = require('moment');
const init = moment();
const logger = require('./lib/logger');

module.exports = {
  gush: function() {
    const sour = require('./lib/sour');
    logger.trace('Loading time', '-', '#duration', moment() - init);
    sour().gush(init).then(this.onFulfilled, this.onReject);
  },
  onFulfilled: function() {
    process.exit(0);
  },
  onReject: function(e) {
    if (e && e.stack) {
      console.error('\nUncatched error:\n\n', e.stack);
    }
    process.exit(-1);
  }
};