'use strict';

module.exports = {
  check: function() {
    this.logger.info('---------PLUGIN TEST--------');
    this.testPluginAddon('Azucar!');
  },

  addons: {

    testPluginAddon: function(name) {
      this.logger.info('Test addon executed', name);
    }
  }
};
