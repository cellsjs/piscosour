'use strict';

// Plugins: ['launcher', 'piscosour', 'fsutils']

const fs = require('fs');

module.exports = {
  description: 'System requirements saver',

  check: function() {
    const fileName = 'requirements.json';
    if (this.params.requirements && this.params.saveRequirements) {
      let requirements = this.fsReadConfig(fileName);
      if (requirements.empty) {
        delete requirements.empty;
      }
      let tmp = {};
      Object.getOwnPropertyNames(this.params.requirements).forEach((cmd) => {
        const options = this.params.requirements[cmd];
        if (!options.npm) {
          tmp[cmd] = options;
        }
      });
      requirements = this.config.mergeObject(requirements, tmp);
      fs.writeFileSync(fileName, JSON.stringify(requirements, null, 2));
    }
  }
};