'use strict';

let path = require('path');
let fs = require('fs');

module.exports = {

  flow: {},

  config: function(resolve) {
    this.logger.info('#magenta', 'config', 'Configuring flow', this.params.flowKey);

    this.fsCreateDir('flows');
    this.fsCreateDir(path.join('flows', this.params.flowKey));

    var file = path.join('flows', this.params.flowKey, 'config.json');

    this.flow = this.fsReadConfig(file, true);
    if (!this.flow.steps) {
      this.flow.steps = {};
      this.inquire('promptsFlow').then(resolve);
      return true;
    }
  },

  run: function() {
    this.logger.info('#magenta', 'run', 'Creating/managing flow', this.params.flowKey);

    this.flow.name = this.params.flowKey;
    this.flow.description = this.params.flowDescription;
    this.flow.type = 'normal';

    var file = path.join('flows', this.params.flowKey, 'config.json');
    fs.writeFileSync(file, JSON.stringify(this.flow, null, 2));
  }
};
