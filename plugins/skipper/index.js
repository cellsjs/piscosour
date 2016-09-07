'use strict';

module.exports = {

  'core-check': function() {
    if (this.params._skip) {
      this.logger.info('#magenta', 'core-check', '#yellow', 'skip step execution');
      return Promise.resolve({ skip: true });
    }
  }

};
