'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {

  check: function(go, stop) {
    this.logger.info('#magenta', 'check', 'Check if this is a piscosour recipe');
    const dest = path.join('shots', this.params.shotName, this.params.repoType);
    if (this.fsExists(dest)) {
      stop('Shot "' + this.params.shotName + '" already exists for repository type: "' + this.params.repoType + '" in this recipe, edit it to change!');
    }
  },

  config: function(go, stop) {
    this.logger.info('#magenta', 'config', 'Configure recipe for the new shot in', this.piscoFile);
    const configLocal = this.fsReadConfig(this.piscoFile);

    if (!configLocal.repoTypes) {
      configLocal.repoTypes = [];
    }

    if (configLocal.repoTypes.indexOf(this.params.repoType) < 0) {
      configLocal.repoTypes.push(this.params.repoType);
    }
    fs.writeFileSync(this.piscoFile, JSON.stringify(configLocal, null, 2));
  },

  run: function(resolve, reject) {
    this.logger.info('#magenta', 'run', 'Creating new shot for this recipe');

    const dest = path.join('shots', this.params.shotName, this.params.repoType);
    const origin = path.join(this.config.getDir('piscosour'), 'templates', '_shot');

    this.fsCreateDir('shots');
    this.fsCreateDir(path.join('shots', this.params.shotName));
    this.fsCreateDir(dest);

    return this.fsCopyDirFiltered(origin, dest).then(resolve, reject);
  },

  prove: function(resolve, reject) {
    this.logger.info('#magenta', 'prove', 'Prove if the shot is propelly executed');
    const dest = path.join('shots', this.params.shotName, this.params.repoType);
    const result = this.sh(`node bin/pisco.js ${this.params.repoType}::${this.params.shotName} --b-disableContextCheck`, reject, true);
    if (result.status !== 0) {
      this.logger.error('#red', 'Error: shot not propelly created!', 'cleaning files!');
      this.sh('rm -rf ' + dest, reject, true);
    }
  },

  emit: function() {
    return {
      shotName: this.params.shotName,
      repoType: this.params.repoType
    };
  }

};