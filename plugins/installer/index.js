'use strict';

const fs = require('fs');
const path = require('path');

const relaunchFile = '.relaunch';

module.exports = {

  'core-install': function() {
    const flowInstaller = this._flow && !this.piscoConfig.isInstalledFlow(this._context, this._flow);
    const stepInstaller = this.requires && !this.installed && flowInstaller;
    this.params._skip = flowInstaller;

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

    const relaunch = () => new Promise((ok, ko) => {
      try {
        this.logger.trace('#green', 'writing .relaunch');
        fs.writeFileSync(relaunchFile, '');
        return ok();
      } catch (e) {
        return ko(e);
      }
    });

    if (stepInstaller) {
      return Promise.resolve()
        .then(() => install())
        .then(() => relaunch())
        .then(() => this.logger.info('#magenta', 'core-install', '#green', 'step installed'))
        .catch((err) => {
          throw err;
        });
    } else {
      this.logger.info('#magenta', 'core-install', '#green', 'step installed');
    }
  }

};