'use strict';

const fsUtils = require('../../lib/utils/fsUtils');

module.exports = {

  check() {
    if (fsUtils.exists('piscosour.json')) {
      return false;
    }
    const pkg = fsUtils.readConfig('package.json', true);

    return pkg.version !== undefined;
  }

};
