'use strict';

let path = require('path');

module.exports = {

  run: function(resolve, reject) {
    var pkgName = this.fsReadConfig(path.join(this.config.getDir('module'), 'package.json')).name;
    this.logger.info('Updating version of ', '#cyan', pkgName);
    return this.execute('npm', ['install', '-g', pkgName]).then(resolve, reject);
  }
};