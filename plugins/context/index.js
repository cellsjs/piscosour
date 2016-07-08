'use strict';

let context = require('../../lib/context');

module.exports = {
  check: function() {
    if (!this.params.disableContextCheck) {
      let ami = this.ctxWhoami();
      if (this._context && ami.indexOf(this._context) < 0) {
        throw {error: 'This is not the root of a ' + this._context};
      }
      this.logger.info('Context checked: ' + ami, '#green', 'OK');
    }
  },

  addons: {
    ctxIs: function(name) {
      return context.cis(name, this.params.workingDir);
    },
    ctxWhoami: function() {
      return context.whoami(this.params.workingDir);
    }
  }
};
