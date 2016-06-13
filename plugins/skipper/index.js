'use strict';

module.exports = {

  check: function() {
    if (this.params._skip) {
      this.logger.info('#magenta', 'check', '#yellow', 'Skipping shot execution!');
      return Promise.resolve({ skip: true });
    }
  }

};
