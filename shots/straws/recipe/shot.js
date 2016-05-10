'use strict';

let path = require('path');
let fs = require('fs');

module.exports = {

  straw: {},

  config: function(resolve) {
    this.logger.info('#magenta', 'config', 'Configuring straw', this.params.strawKey);

    this.fsCreateDir('straws');
    this.fsCreateDir(path.join('straws', this.params.strawKey));

    var file = path.join('straws', this.params.strawKey, 'straw.json');

    this.runner.straw = this.fsReadConfig(file, true);
    if (!this.runner.straw.shots) {
      this.runner.straw.shots = {};
      this.inquire('promptsStraw').then(resolve);
      return true;
    }
  },

  run: function() {
    this.logger.info('#magenta', 'run', 'Creating/managing straw', this.params.strawKey);

    if (this.params.strawName) {
      this.runner.straw.name = this.params.strawName;
      this.runner.straw.description = this.params.strawDescription;
      this.runner.straw.type = 'normal';
    }

    var file = path.join('straws', this.params.strawKey, 'straw.json');
    fs.writeFileSync(file, JSON.stringify(this.runner.straw, null, 4));
  }
};