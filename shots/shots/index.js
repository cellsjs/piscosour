'use strict';

let fs = require('fs');
let path = require('path');

module.exports = {

  check: function(go, stop) {
    this.logger.info('#magenta', 'check', 'Check if this is a piscosour recipe');
    var dest = path.join('shots', this.params.shotName, this.params.repoType);
    if (this.fsExists(dest)) {
      stop('Shot "' + this.params.shotName + '" already exists for repository type: "' + this.params.repoType + '" in this recipe, edit it to change!');
    }
  },

  config: function(go, stop) {
    this.logger.info('#magenta', 'config', 'Configure recipe for the new shot in', this.piscoFile);
    var configLocal = this.fsReadConfig(this.piscoFile);

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

    var dest = path.join('shots', this.params.shotName, this.params.repoType);
    var origin = path.join(this.piscoConfig.getDir('piscosour'), 'templates', '_shot');

    this.fsCreateDir('shots');
    this.fsCreateDir(path.join('shots', this.params.shotName));
    this.fsCreateDir(dest);

    return this.fsCopyDirFiltered(origin, dest).then(resolve, reject);
  },

  prove: function(resolve, reject) {
    this.logger.info('#magenta', 'prove', 'Prove if the shot is propelly executed');
    var dest = path.join('shots', this.params.shotName, this.params.repoType);
    var result = this.sh('node bin/pisco.js ' + this.params.repoType + '::' + this.params.shotName, reject, true);
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