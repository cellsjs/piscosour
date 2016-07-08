'use strict';

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

module.exports = {

  check: function(go, stop) {
    this.logger.info('#magenta', 'check', 'Check if this is a piscosour recipe');
    var dest = path.join('steps', this.params.stepName);
    if (this.fsExists(dest)) {
      stop('Step "' + this.params.stepName + '" already exists for context: "' + this.params.context + '" in this recipe, edit it to change!');
    }
  },

  run: function(resolve, reject) {
    this.logger.info('#magenta', 'run', 'Creating new step for this recipe');

    var dest = path.join('steps', this.params.stepName);
    var origin = path.join(this.piscoConfig.getDir('piscosour'), 'templates', '_step');

    this.fsCreateDir('steps');
    this.fsCreateDir(path.join('steps', this.params.stepName));
    this.fsCreateDir(dest);

    const _writeConfig = () => {
      try {
        const configFile = path.join(dest, 'config.json');

        let config = this.fsReadConfig(configFile);
        config.name = this.params.stepName;
        config.contexts.push(this.params.context);

        fs.writeFileSync(configFile, JSON.stringify(config, null, 2));

        return Promise.resolve();
      } catch (err) {
        return Promise.reject(err);
      }
    };

    return this.fsCopyDirFiltered(origin, dest)
      .then(() => _writeConfig())
      .then(resolve, reject);
  },

  prove: function(resolve, reject) {
    this.logger.info('#magenta', 'prove', 'Prove if the step is propelly executed');
    var dest = path.join('steps', this.params.stepName);
    var result = this.sh('node bin/pisco.js ' + this.params.context + '::' + this.params.stepName, reject, true);
    if (result.status !== 0) {
      this.logger.error('#red', 'Error: step not propelly created!', 'cleaning files!');
      rimraf.sync(dest);
    }
  },

  emit: function() {
    return {
      stepName: this.params.stepName,
      context: this.params.context
    };
  }

};
