'use strict';


const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const semver = require('semver');

const requirements = require('../../lib/utils/requirements');

const relaunchFile = '.relaunch';


module.exports = {

  'core-install': function() {
    const getRequirement = (pkg, installable) => {
      const cmd = pkg;
      const options = {
        installer: 'npm',
        listedIn: 'npm'
      };
      const father = this.params.versions[options.installer];

      if (semver.valid(installable) || semver.validRange(installable)) {
        options.version = installable;
      } else {
        options.uri = installable;
      }

      return { cmd, options, father };
    };


    const installRequirement = (requirement) => {
      const cmd = requirement.cmd;
      const father = requirement.father;
      const options = _.merge({},
        requirement.options,
        requirement.father);

      return Promise.resolve()
        .then(() => requirements.sh(cmd, options, father))
        .then(result => requirements.check(cmd, options, result, father))
        .catch((checked) => {
          return this.systemInstall(cmd, options)
            .then(() => requirements.sh(cmd, options, father, true));
        });
    };


    const installRequirements = () => {
      const promises = [];
      Object.getOwnPropertyNames(this.requires).forEach((pkg) => {
        const installable = this.requires[pkg];
        const requirement = getRequirement(pkg, installable);
        promises.push(installRequirement(requirement));
      });
      return Promise.all(promises);
    };


    const relaunch = () => new Promise((ok, ko) => {
      try {
        this.logger.trace('#green', 'writing .relaunch');
        fs.writeFileSync(relaunchFile, '');
        return ok();
      } catch (e) {
        return ko(e);
      }
    });


    const flowInstaller = this._flow && !this.piscoConfig.isInstalledFlow(this._context, this._flow);
    const stepInstaller = this.requires && !this.installed && flowInstaller;
    this.params._skip = this.params._skip || flowInstaller;

    if (stepInstaller) {
      return Promise.resolve()
        .then(() => installRequirements())
        .then(() => relaunch())
        .then(() => this.logger.info('#magenta', 'core-install', '#green', 'step installed'))
        .catch((err) => {
          throw err;
        });
    } else if (flowInstaller) {
      this.logger.info('#magenta', 'core-install', '#green', 'step already installed');
    }
  }

};
