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
    let message = e;
    let fatal = false;
    if (e && e.stack) {
      message += e.stack;
      fatal = true;
      console.error('\nUncatched error:\n\n', e.stack);
    }
    require('./lib/analytics').error(message, fatal, () => {
      process.exit(-1);
    });
  }
};