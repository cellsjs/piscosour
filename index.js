'use strict';

const fs = require('fs');

const moment = require('moment');

const config = require('./lib/config');
const fsUtils = require('./lib/utils/fsUtils');
const logger = require('./lib/logger');

const relaunch = '.relaunch';


const gush = function() {
  const init = moment();
  const sour = require('./lib/sour');
  logger.trace('Loading time', '-', '#duration', moment() - init);
  sour().gush(init).then(onFulfilled, onReject);
};

const onFulfilled = function() {
  if (fsUtils.exists(relaunch)) {
    try {
      fs.unlinkSync(relaunch);
    } catch (e) {
    }
    process.stdout.write('\n');
    config.refresh(true);
    gush();
  } else {
    process.exit(0);
  }
};

const onReject = function(e) {
  let message = e;
  let fatal = false;
  if (e && e.stack) {
    message += e.stack;
    fatal = true;
    console.error('\nUncatched error:\n\n', e.stack);
  }
  const params = require('./lib/params');
  const analytics = require('./lib/analytics');
  analytics.error(message, fatal, params.normal, () => {
    process.exit(-1);
  });
};

module.exports = {
  gush: gush,
  onFulfilled: onFulfilled,
  onReject: onReject
};
