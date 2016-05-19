'use strict';

let context = require('../../lib/context');

module.exports = {
  description: 'Get automatic context of execution',

  check: function() {
    if (!this.params.contextFree) {
      let ami = this.ctxWhoami();
      if (!this.params.disableContextCheck && this._repoType && ami.indexOf(this._repoType) < 0) {
        throw {error: 'This is not the root of a ' + this._repoType};
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