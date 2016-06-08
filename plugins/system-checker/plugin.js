'use strict';

// Plugins: ['launcher', 'piscosour', 'fsutils']

const semver = require('semver');
const os = require('os');
const path = require('path');
const fs = require('fs');

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
    const _sh = (cmd, option, module) => {
      if (module) {
        const result = this.sh(`npm list ${cmd} --depth 0 -g`, null, false);
        const version = result.stdout.toString().match(`${cmd}\@(.*?) `);
        if (version && version.length > 1) {
          result.stdout = new Buffer(version[1]);
        }
        return result;
      } else if (option) {
        return this.sh(`${cmd} ${option}`, null, false);
      } else {
        return this.sh(cmd, null, false);
      }
    };
    const _check = (cmd, options) => {
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
        if (result.status === 127) {
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
            this.logger.warn('#yellow', 'Uncoherent definition of requirements', 'option: "' + sum[cmd].option + '"  =>  "' + added[cmd].option + '" ; regexp: "' + sum[cmd].regexp + '"  =>  "' + added[cmd].regexp + '"');
          }
        } else {
          sum[cmd] = added[cmd];
        }
      }
      return sum;
    };
    const fileName = 'requirements.json';

    let promise;
    ['requirements', 'npm-requirements'].forEach((paramName) => {
      if (this.params[paramName]) {
        for (let cmd in this.params[paramName]) {
          if (this.params[paramName].hasOwnProperty(cmd)) {
            const option = this.config.mergeObject(this.params[paramName][cmd], this.params.versions[cmd]);
            promise = _check(cmd, option);
            if (promise && paramName.startsWith('npm')) {
              let p = option.uri ? `git+${option.uri}` : (option.pkg ? option.pkg : cmd);
              p = option.version ? `${p}@${option.version}` : p;
              this.logger.info('#cyan', cmd, 'is required -> ', '#green', cmd, 'is installing...');
              let res = this.sh(`npm install -g ${p}`, null, true);
              if (res.status !== 0) {
                promise = Promise.reject({error: `impossible to install ${p}`});
                return;
              } else {
                promise = undefined;
              }
            } else {
              return;
            }
          }
        }
      }
    });

    if (promise) {
      return promise;
    }

    if (this.params.requirements && this.params.saveRequirements) {
      let requirements = this.fsReadConfig(fileName);
      if (requirements.empty) {
        delete requirements.empty;
      }
      requirements = _sumRequirements(requirements, this.params.requirements);
      fs.writeFileSync(fileName, JSON.stringify(requirements, null, 2));
    }
  }
};