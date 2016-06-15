'use strict';

module.exports = {
  run: function(resolve, reject) {
    this.logger.info('Weather in ', '#green', this.params.city);
    this.sh('curl -s -A curl http://wttr.in/' + this.params.city, null, true);
  }
};
