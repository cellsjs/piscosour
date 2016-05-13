'use strict';

const semver = require('semver');
const os = require('os');

module.exports = {
  description: 'System requirements checker',

  check: function() {
    const _getVersion = (regexp, out, err) => {
      let txt = !out || out.length === 0 ? err : out;
      if (txt && txt.length > 0) {
        if (regexp) {
          return txt.match(regexp)[1];
        } else {
          return txt.replace(os.EOL, '');
        }
      }
    };
    const _check = (cmd, options) => {
      if (options.version) {
        let option = options.option ? options.option : '-v';
        const result = this.sh(`${cmd} ${option}`, null, false);
        if (result.status !== 0) {
          return Promise.reject({error: `'${cmd}' is not accesible!!`, data: result.stderr.toString()});
        } else {
          let actual = _getVersion(options.regexp, result.stdout.toString(), result.stderr.toString());
          if (!semver.valid(actual)) {
            this.logger.info('#cyan', cmd, '(', options.version, ') is required -> ', '#red', cmd, '(', actual, ') impossible to parse ...', '#yellow', 'WARNING!');
          } else if (actual && semver.lt(actual, options.version)) {
            return Promise.reject({error: `'${cmd}' is not up to date!! version is: '${actual}' required: '${options.version}'`});
          } else {
            this.logger.info('#cyan', cmd, '(', options.version, ') is required -> ', '#green', cmd, '(', actual, ') is installed ...', '#green', 'OK');
          }
        }
      } else {
        const result = this.sh(cmd, null, false);
        if (result.status !== 0) {
          return Promise.reject({error: `'${cmd}' is not accesible!!`, data: result.stderr.toString()});
        }
        this.logger.info('#cyan', cmd, '( any version ) is required -> ', '#green', cmd, 'is installed ...', '#green', 'OK');
      }
    };
    if (this.params.requirements && this.params.syscheck) {
      for (var cmd in this.params.requirements) {
        if (this.params.requirements.hasOwnProperty(cmd)) {
          let promise = _check(cmd, this.params.requirements[cmd]);
          if (promise) {
            return promise;
          }
        }
      }
    }
  }
};