'use strict';

module.exports = {

  config: function(resolve) {
    this.logger.info('#magenta', 'config', 'Preparing params for main execution');
    this.logger.info('this.params.inflying:', this.params.inflying);
    this.logger.info('this.params.otracosa:', this.params.otracosa);
  },

  run: function(resolve, reject) {
    this.logger.info('#magenta', 'run', 'Run main execution');
    this.logger.info('execution: ', this.params.execution);
    this.testPluginAddon(' - test plugin addon!');
  },

  prove: function(resolve, reject) {
    this.logger.info('#magenta', 'prove', 'Prove that the run execution was ok');
  },

  notify: function(resolve) {
    this.logger.info('#magenta', 'notify', 'Recollect all execution information and notify');
  },

  emit: function() {
    return {
      localmovida: 'Un valor dado'
    };
  }
};