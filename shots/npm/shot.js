'use strict';

let path = require('path');
let semver = require('semver');

module.exports = {

  check: function(resolve) {
    this.logger.error('#red', 'THIS SHOT IS DEPRECATED!! WILL BE DELETED SOON!!', 'use requirements in params.json instead!!!', 'Checking all npm commands are already installed');

    this.params.installCmds.forEach((cmd) => {
      var command = cmd.args[2];

      this.logger.info('Checking', '#cyan', command, '...');
      if (command.indexOf('https://') >= 0) {
        command = path.parse(command).name;
        if (cmd.version) {
          cmd.args[2] = `${cmd.args[2]}#${cmd.version}`;
        }
      }

      var result = this.executeSync('npm', ['list', '-g', '--depth', '1', command]);

      if (result.status === 0) {
        let version = this.runner._getVersion(result.stdout.toString());
        if (cmd.version && semver.lt(version, cmd.version)) {
          this.logger.info(command, 'is installed .................', '#yellow', 'OUT OF DATE!');
          this.logger.info('version: ', version, 'must to be up to', cmd.version);
          cmd.args[0] = 'install';
          resolve({skip: false});
        } else {
          this.logger.info(command, 'is installed .................', '#green', 'OK');
          this.logger.info('version: ', version);
          cmd.skip = true;
        }
      } else {
        this.logger.info(command, '#red', 'is not installed!');
        resolve({skip: false});
      }
    });
    resolve({skip: true});
  },

  _getVersion: function(str) {
    return str !== undefined ? str.match('\@(.*?) ')[1] : '';
  },

  run: function(resolve, reject) {
    this.logger.error('#red', 'THIS SHOT IS DEPRECATED!! WILL BE DELETED SOON!!', 'use requirements in params.json instead!!!', 'Installing npm dependencies...');
    return this.executeParallel(this.params.installCmds).then(resolve, reject);
  }
};