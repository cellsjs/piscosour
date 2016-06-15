'use strict';

module.exports = {

  config: function(resolve) {
    this.logger.info('this.params.inflying:', this.params.inflying);
    this.logger.info('this.params.otracosa:', this.params.otracosa);
  },
  run: function(resolve, reject) {
    this.logger.info('execution: ', this.params.execution);
    this.testPluginAddon(' - test plugin addon!');
  },
  prove: function(resolve, reject) {},
  notify: function(resolve) {},
  emit: function() {
    return {
      localmovida: 'Un valor dado'
    };
  }
};
