'use strict';

let context = require('../../lib/context');

module.exports = {
  description: 'Get automatic context of execution',

  check: function() {
    if (!this.params.contextFree) {
      var ami = this.ctxWhoami();
      /*
      TODO: Detectar que receta requiere el shot.
          throw {error: 'This is not the root of a ' + mustType};
      */

      this.logger.info('This shot is in the root of a ' + ami, '#green', 'OK');
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