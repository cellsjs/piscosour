'use strict';

const semver = require('semver');
const os = require('os');
const fs = require('fs');

module.exports = {

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
    const _sh = (cmd, option, module) => {
      if (module) {
        const result = this.sh(`npm list ${module} --depth 0 -g`, null, false);
        result.stdout = new Buffer(result.stdout.toString().match(`${module}\@(.*?) `)[1]);
        return result;
      } else if (option) {
        return this.sh(`${cmd} ${option}`, null, false);
      } else {
        return this.sh(cmd, null, false);
      }
    };
    const _check = (cmd, options) => {
      if (options.module) {
        if (cmd !== 'npm') {
          this.logger.warn('#yellow', 'Module was defined on a command diferent to "npm"');
        }
        cmd = options.module;
      }
      if (options.version) {
        let option = options.option ? options.option : '-v';
        const result = _sh(cmd, option, options.module);
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
        const result = _sh(cmd, null, options.module);
        if (result.status !== 0) {
          return Promise.reject({error: `'${cmd}' is not accesible!!`, data: result.stderr.toString()});
        }
        this.logger.info('#cyan', cmd, '( any version ) is required -> ', '#green', cmd, 'is installed ...', '#green', 'OK');
      }
    };
    const _sumRequirements = (sum, added) => {
      for (let cmd in added) {
        if (sum[cmd]) {
          if (!sum[cmd].version || (added[cmd].version && semver.lt(sum[cmd].version, added[cmd].version))) {
            sum[cmd].version = added[cmd].version;
          }
          if (sum[cmd].option !== added[cmd].option || sum[cmd].regexp !== added[cmd].regexp) {
            this.logger.warn('#yellow', 'Incoherent definition of requirements', 'option: "' + sum[cmd].option + '"  =>  "' + added[cmd].option + '" ; regexp: "' + sum[cmd].regexp + '"  =>  "' + added[cmd].regexp + '"');
          }
        } else {
          sum[cmd] = added[cmd];
        }
      }
      return sum;
    };

    const fileName = 'requirements.json';

    if (this.params.requirements) {
      for (let cmd in this.params.requirements) {
        if (this.params.requirements.hasOwnProperty(cmd)) {
          let promise = _check(cmd, this.params.requirements[cmd]);
          if (promise) {
            return promise;
          }
        }
      }

      if (this.params.saveRequirements) {
        let requirements = this.fsReadConfig(fileName);
        if (requirements.empty) {
          delete requirements.empty;
        }
        requirements = _sumRequirements(requirements, this.params.requirements);
        fs.writeFileSync(fileName, JSON.stringify(requirements, null, 2));
      }
    }
  }
};
