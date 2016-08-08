'use strict';

// Plugins: ['launcher', 'piscosour', 'fsutils']

const semver = require('semver');
const os = require('os');
const path = require('path');
const fs = require('fs');
const cache = {};

module.exports = {
  description: 'System requirements checker',

  'core-check': function() {

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
    const _processVersion = (result, regexp) => {
      const version = result.stdout.toString().match(regexp);
      let res;
      if (version && version.length > 1) {
        res = {stdout: new Buffer(version[1]), stderr: new Buffer(version[1]), status: 0};
      } else {
        const msg = 'not found';
        res = {stdout: new Buffer(msg), stderr: new Buffer(msg), status: -100};
      }
      return res;
    };
    const _cachedExec = (command) => {
      let result = cache[command];
      if (!result) {
        result = new Promise((ok, ko) => {
          this.logger.info('Waiting for', '#green', command, '...');
          cache[command] = this.sh(command);
          ok(cache[command]);
        });
        cache[command] = result;
      } else if (!result.then) {
        result = Promise.resolve(result);
      }
      return result;
    };
    const _sh = (cmd, options) => {
      if (options.listedIn) {
        const father = this.params.requirements[options.listedIn];
        if (father && father.list) {
          this.logger.trace('Getting list for', cmd);
          return Promise.resolve()
            .then(() => _cachedExec(father.list))
            .then((result) => _processVersion(result, `${options.key ? options.key : cmd}${options.regexp !== undefined ? options.regexp : father.regexp}`));
        } else {
          return Promise.reject({error: `There is no definition for listing in ${options.listedIn}`});
        }
      } else {
        let option = options.option ? options.option : '-v';
        return _cachedExec(options.version ? `${cmd} ${option}` : cmd);
      }
    };
    const _check = (cmd, options, result) => new Promise((ok, ko) => {
      let out = {version: options.version};
      if (options.version) {
        if (result.status !== 0) {
          out.error = `'${cmd}' is not found!!`;
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
        if (result.status === 127) {
          out.error = `'${cmd}' is not accesible!!`;
          out.data = result.stderr.toString();
        } else if (result.status === -100) {
          out.version = out.version ? out.version : 'any';
          out.error = `'${options.key}' is not in list!!`;
          out.data = result.stderr.toString();
        } else {
          out.version = out.version ? out.version : 'any';
          out.message = ['#green', cmd, 'is installed ...', '#green', 'OK'];
        }
      }
      this.logger.info.apply(this.logger, ['#cyan', cmd, '(', out.version, ') is required -> '].concat(out.message ? out.message : [out.error, '...', '#red', 'ERROR!']));
      if (out.error) {
        ko(out);
      } else {
        ok(out);
      }
    });
    const _installable = (cmd, option) => {
      let p = option.uri ? `git+${option.uri}` : (option.pkg ? option.pkg : cmd);
      const versionchar = option.uri ? '#' : '@';
      p = option.version ? `${p}${versionchar}${option.version}` : p;
      return p;
    };
    const _install = (cmd, option) => {
      this.logger.info('#cyan', cmd, 'is required -> ', '#green', cmd, 'is installing...');
      const installable = _installable(cmd, option);
      let res = this.sh(`${option.cmdInstaller} ${installable}`, null, true);
      if (res.status !== 0) {
        throw {error: `impossible to install ${installable} using ${option.cmdInstaller}`};
      }
      return true;
    };
    const fileName = 'requirements.json';

    if (this.params.requirements && (!this.params.disableSystemCheck || this.params.disableSystemCheck === 'null')) {
      const tmp = this.params.requirements;
      this.params.requirements = this.config.mergeObject(this.params.versions, this.params.requirements);
      const promises = [];
      Object.getOwnPropertyNames(tmp).forEach((cmd) => {
        const options = this.params.requirements[cmd];
        promises.push(Promise.resolve()
          .then(() => _sh(cmd, options))
          .then((result) => _check(cmd, options, result))
          .catch((checked) => {
            if (options.installer && this.params.requirements[options.installer]) {
              options.cmdInstaller = this.params.requirements[options.installer].cmdInstaller;
              _install(cmd, options);
            } else if (!this.params.neverStop) {
              throw checked;
            }
          })
        );
      });
      return Promise.all(promises);
    }
  }
};