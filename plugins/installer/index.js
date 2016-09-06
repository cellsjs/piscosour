'use strict';

const fs = require('fs');
const path = require('path');

const relaunchFile = '.relaunch';
let installed = false;

module.exports = {

  'core-install': function() {
    installed = this.requires && !this.installed && this.params._installer;
    this.params._skip = this.params._installer;

    const install = () => {
      const promises = [];
      Object.getOwnPropertyNames(this.requires).forEach((module) => {
        let installable = this.requires[module];
        installable = installable.indexOf('git+') >= 0 ? installable : `${module}@${installable}`;
        this.logger.info('#green', 'installing', module, '->', installable);
        promises.push(this.execute('npm', ['install', '-g', installable]));
      });
      return Promise.all(promises);
    };

    const update = () => {
      this.logger.trace('#green', 'updating scullion.json');
      this.piscoConfig.refresh(true);
      return Promise.resolve();
    };

    const relaunch = () => new Promise((ok, ko) => {
      try {
        this.logger.trace('#green', 'writing .relaunch');
        fs.writeFileSync(relaunchFile, '');
        return ok();
      } catch (e) {
        return ko(e);
      }
    });

    if (installed) {
      return Promise.resolve()
        .then(() => install())
        .then(() => update())
        .then(() => relaunch())
        .catch((err) => {
          installed = false;
          throw err;
        });
    }
  }

};