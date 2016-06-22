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
        const result = this.sh(`npm list ${cmd} --depth 0 -g`);
        const version = result.stdout.toString().match(`${cmd}\@(.*?) `);
        if (version && version.length > 1) {
          result.stdout = new Buffer(version[1]);
        }
        return result;
      } else if (option) {
        return this.sh(`${cmd} ${option}`);
      } else {
        return this.sh(cmd);
      }
    };
    const _check = (cmd, options) => {
      let out = {version: options.version};
      if (options.version) {
        let option = options.option ? options.option : '-v';
        const result = _sh(cmd, option, options.module);
        if (result.status !== 0) {
          out.error = `'${cmd}' is not accesible!!`;
          out.data = result.stderr.toString();
        } else {
          let actual = _getVersion(options.regexp, result.stdout.toString(), result.stderr.toString());
          if (!semver.valid(actual)) {
            out.message = ['#red', cmd, '(', actual, ') impossible to parse ...', '#yellow', 'WARNING!'];
          } else if (actual && semver.lt(actual, options.version)) {
            out.error = `'${cmd}' is not up to date!! version is: '${actual}' required: '${options.version}'`;
          } else {
            out.message = ['#green', cmd, '(', actual, ') is installed ...', '#green', 'OK'];
          }
        }
      } else {
        const result = _sh(cmd, null, options.module);
        if (result.status === 127) {
          out.error = `'${cmd}' is not accesible!!`;
          out.data = result.stderr.toString();
        } else {
          out.version = 'any';
          out.message = ['#green', cmd, 'is installed ...', '#green', 'OK'];
        }
      }
      this.logger.info.apply(this.logger, ['#cyan', cmd, '(', out.version, ') is required -> '].concat(out.message ? out.message : [out.error, '...', '#red', 'ERROR!']));
      return out;
    };
    const _sumRequirements = (sum, added) => {
      for (let cmd in added) {
        if (!added[cmd].npm) {
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
      }
      return sum;
    };
    const _installable = (cmd, option) => {
      let p = option.uri ? `git+${option.uri}` : (option.pkg ? option.pkg : cmd);
      const versionchar = option.uri ? '#' : '@';
      p = option.version ? `${p}${versionchar}${option.version}` : p;
      return p;
    };
    const _install = (cmd, option) => {
      this.logger.info('#cyan', cmd, 'is required -> ', '#green', cmd, 'is installing...');
      const installable = _installable(cmd, option);
      let res = this.sh(`npm install -g ${installable}`, null, true);
      if (res.status !== 0) {
        throw {error: `impossible to install ${installable}`};
      }
      return true;
    };
    const fileName = 'requirements.json';

    if (this.params.requirements && (!this.params.disableSystemCheck || this.params.disableSystemCheck === 'null')) {
      for (let cmd in this.params.requirements) {
        if (this.params.requirements.hasOwnProperty(cmd)) {
          const option = this.config.mergeObject(this.params.requirements[cmd], this.params.versions[cmd]);
          const checked = _check(cmd, option);
          if (checked.error) {
            if (option.npm) {
              _install(cmd, option);
            } else if (!this.params.neverStop) {
              throw checked;
            }
          }
        }
      }
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