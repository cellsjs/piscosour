'use strict';

let fs = require('fs');
let path = require('path');

module.exports = {

  whendefaultContext: function(answer) {
    return answer.doDefault;
  },

  getDefault: function() {
    var configLocal = this.fsReadConfig(this.piscoFile);
    return configLocal.defaultContext;
  },

  config: function(go, stop) {
    this.logger.info('#magenta', 'config', 'Configure recipe', this.piscoFile);
    var configLocal = this.fsReadConfig(this.piscoFile);

    if (this.params.defaultContext) {

      if (!configLocal.contexts) {
        configLocal.contexts = [];
      }

      if (configLocal.contexts.indexOf(this.params.defaultContext) < 0) {
        configLocal.contexts.push(this.params.defaultContext);
      }

      configLocal.defaultContext = this.params.defaultContext;

      fs.writeFileSync(this.piscoFile, JSON.stringify(configLocal, null, 2));
    }

    var fixDeprecated = function() {
      if (configLocal.flows) {
        Object.getOwnPropertyNames(configLocal.flows).forEach((name) => {
          var local = configLocal.flows[name];
          var flowFile = path.join(this.piscoConfig.get().rootDir, 'flows', name, 'flow.json');
          var flow = this.fsReadConfig(flowFile);
          flow.type = local.type;
          flow.name = local.name;
          flow.description = local.description;
          fs.writeFileSync(flowFile, JSON.stringify(flow, null, 2));
        });
      }
      delete configLocal.flows;
      fs.writeFileSync(this.piscoFile, JSON.stringify(configLocal, null, 2));
      this.logger.info('#green', 'piscosour.json fixed!');
      go();
    };

    if (configLocal.flows) {
      this.inquire('promptsPisco').then(fixDeprecated);
      return true;
    }
  }
};