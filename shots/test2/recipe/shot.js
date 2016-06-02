'use strict';

module.exports = {

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
