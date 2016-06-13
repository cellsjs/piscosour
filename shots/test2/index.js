'use strict';

module.exports = {

  check(resolve) {
    console.log('==========================');
    console.log(this);
    console.log('==========================');
    this.logger.info('#magenta', 'check', 'Check all pre-requisites for the execution');
  },

  config: function(resolve, reject) {
    this.logger.info('this.params.saludo: ', this.params.saludo);
  },

  run: function(resolve, reject) {
    reject({keep: true, error: 'TEST ERROR'});
  },

  emit: function() {
    return {
      flying: this.params.flying
    };
  }

};
