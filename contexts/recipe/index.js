'use strict';

const fsUtils = require('../../lib/utils/fsUtils');

module.exports = {

  check() {
    const piscofile = fsUtils.readConfig('.piscosour/piscosour.json', true);
    if (piscofile.repoType === 'recipe') {
      return true;
    }
    const pkgfile = fsUtils.readConfig('package.json', true);

    return pkgfile.keywords !== undefined
      && pkgfile.keywords.indexOf('piscosour-recipe') >= 0
      && fsUtils.exists('piscosour.json');
  }

};
