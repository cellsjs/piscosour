'use strict';

const context = require('../../lib/context');
const search = require('../../lib/utils/search');

module.exports = {
  check: function() {
    if (!this.params.disableContextCheck && !this.params.isGenerator) {
      let ami = this.ctxWhoami();
      if (this._context && ami.indexOf(this._context) < 0) {
        throw {error: 'This is not the root of a ' + this._context};
      }
      this.logger.trace('Context checked: ' + this._context, '#green', 'OK');
    }
  },

  addons: {
    ctxIs(name) {
      return context.cis(name);
    },
    ctxWhoami() {
      return context.whoami();
    },
    searchNpm: search.searchByKeyword
  }
};
