'use strict';

const path = require('path');

let installed = false;

module.exports = {

  'core-install': function() {
    installed = this.requires && !this.installed;
    if (installed) {
      const promises = [];
      Object.getOwnPropertyNames(this.requires).forEach((module) => {
        let installable = this.requires[module];
        installable = installable.indexOf('git+') >= 0 ? installable : `${module}@${installable}`;
        this.logger.info('#green', 'installing', module, '->', installable);
        promises.push(this.execute('npm', ['install', '-g', installable]));
      });
      return Promise.all(promises)
        .catch((err) => {
          installed = false;
          throw err;
        });
    }
  },

  config: function() {
    if (installed) {
      this.logger.trace('#green', 'updating scullion.json');
      return this.execute(process.execPath, [path.join(this.piscoConfig.getDir('module'), 'bin', 'pisco.js'), '-w']);
    }
  },

  run: function() {
    if (installed) {
      const command = `${this._context}::${this.name}`;
      this.logger.info('#green', 'executing', command);
      return this.execute(process.execPath, [path.join(this.piscoConfig.getDir('module'), 'bin', 'pisco.js'), command])
        .catch((err) => {
          err.keep = true;
          err.data = err.output;
          throw err;
        });
    }
  }

};