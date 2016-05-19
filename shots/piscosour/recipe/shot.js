'use strict';

let fs = require('fs');
let path = require('path');

module.exports = {

  whenDefaultType: function(answer) {
    return answer.doDefault;
  },

  getDefault: function() {
    var configLocal = this.fsReadConfig(this.piscoFile);
    return configLocal.defaultType;
  },

  config: function(go, stop) {
    this.logger.info('#magenta', 'config', 'Configure recipe', this.piscoFile);
    var configLocal = this.fsReadConfig(this.piscoFile);

    if (this.params.defaultType) {

      if (!configLocal.repoTypes) {
        configLocal.repoTypes = [];
      }

      if (configLocal.repoTypes.indexOf(this.params.defaultType) < 0) {
        configLocal.repoTypes.push(this.params.defaultType);
      }

      configLocal.defaultType = this.params.defaultType;

      fs.writeFileSync(this.piscoFile, JSON.stringify(configLocal, null, 2));
    }

    var fixDeprecated = function() {
      if (configLocal.straws) {
        Object.getOwnPropertyNames(configLocal.straws).forEach((name) => {
          var local = configLocal.straws[name];
          var strawFile = path.join(this.config.rootDir, 'straws', name, 'straw.json');
          var straw = this.fsReadConfig(strawFile);
          straw.type = local.type;
          straw.name = local.name;
          straw.description = local.description;
          fs.writeFileSync(strawFile, JSON.stringify(straw, null, 2));
        });
      }
      delete configLocal.straws;
      fs.writeFileSync(this.piscoFile, JSON.stringify(configLocal, null, 2));
      this.logger.info('#green', 'piscosour.json fixed!');
      go();
    };

    if (configLocal.straws) {
      this.inquire('promptsPisco').then(fixDeprecated);
      return true;
    }
  }
};