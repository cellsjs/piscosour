'use strict';

let fs = require('fs');
let path = require('path');

module.exports = {

  check: function(go, stop) {
    this.logger.info('#magenta', 'check', 'Check if this is a piscosour recipe');
    var dest = path.join('steps', this.params.stepName, this.params.context);
    if (this.fsExists(dest)) {
      stop('Step "' + this.params.stepName + '" already exists for context: "' + this.params.context + '" in this recipe, edit it to change!');
    }
  },

  config: function(go, stop) {
    this.logger.info('#magenta', 'config', 'Configure recipe for the new step in', this.piscoFile);
    var configLocal = this.fsReadConfig(this.piscoFile);

    if (!configLocal.contexts) {
      configLocal.contexts = [];
    }

    if (configLocal.contexts.indexOf(this.params.context) < 0) {
      configLocal.contexts.push(this.params.context);
    }
    fs.writeFileSync(this.piscoFile, JSON.stringify(configLocal, null, 2));
  },

  run: function(resolve, reject) {
    this.logger.info('#magenta', 'run', 'Creating new step for this recipe');

    var dest = path.join('steps', this.params.stepName, this.params.context);
    var origin = path.join(this.piscoConfig.getDir('piscosour'), 'templates', '_step');

    this.fsCreateDir('steps');
    this.fsCreateDir(path.join('steps', this.params.stepName));
    this.fsCreateDir(dest);

    return this.fsCopyDirFiltered(origin, dest).then(resolve, reject);
  },

  prove: function(resolve, reject) {
    this.logger.info('#magenta', 'prove', 'Prove if the step is propelly executed');
    var dest = path.join('steps', this.params.stepName, this.params.context);
    var result = this.sh('node bin/pisco.js ' + this.params.context + '::' + this.params.stepName, reject, true);
    if (result.status !== 0) {
      this.logger.error('#red', 'Error: step not propelly created!', 'cleaning files!');
      this.sh('rm -rf ' + dest, reject, true);
    }
  },

  emit: function() {
    return {
      stepName: this.params.stepName,
      context: this.params.context
    };
  }

};
