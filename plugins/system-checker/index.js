'use strict';

// Plugins: ['launcher']

const requirements = require('../../lib/utils/requirements');

module.exports = {
  description: 'System requirements checker',

  'core-check': function() {

    const _install = (cmd, option) => {
      this.logger.info('#cyan', cmd, 'is required -> ', '#green', cmd, 'is installing...');
      const installable = this.systemInstallable(cmd, option);
      const cmds = option.cmdInstaller.split(' ');
      return this.execute(cmds[0], cmds.slice(1).concat([ installable ]));
    };

    if (this.params.requirements && (!this.params.disableSystemCheck || this.params.disableSystemCheck === 'null')) {
      const tmp = this.params.requirements;
      this.params.requirements = this.piscoConfig.mergeObject(this.params.versions, this.params.requirements);
      const promises = [];
      Object.getOwnPropertyNames(tmp).forEach((cmd) => {
        const options = this.params.requirements[cmd];
        const father = this.params.requirements[options.listedIn];
        promises.push(Promise.resolve()
          .then(() => requirements.sh(cmd, options, father))
          .then((result) => requirements.check(cmd, options, result, father), (result) => requirements.check(cmd, options, result, father))
          .catch((checked) => {
            if (options.installer && this.params.requirements[options.installer]) {
              options.cmdInstaller = this.params.requirements[options.installer].cmdInstaller;
              return _install(cmd, options)
                .then(() => requirements.sh(cmd, options, father, true)
                  .catch((e) => this.logger.trace('ignored error! ->', e)))
            } else if (!this.params.neverStop) {
              throw checked;
            }
          })
        );
      });
      return Promise.all(promises);
    }
  },

  addons: {
    systemInstallable(cmd, option){
      let p = option.uri ? `git+${option.uri}` : (option.pkg ? option.pkg : cmd);
      const versionchar = option.uri ? '#' : '@';
      p = option.version ? `${p}${versionchar}${option.version}` : p;
      return p;
    }
  }
};
