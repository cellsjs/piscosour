'use strict';

// Plugins: ['launcher', 'piscosour', 'fsutils']

const fs = require('fs');

module.exports = {
  description: 'System requirements saver',

  //TODO: Mejorar esto 1) guardar el resultado en una variable global en lugar de escribir en disco 2) detectar (this.isLast) el último shot del straw y escribir entonces
  'core-check': function() {
    const fileName = 'requirements.json';
    if (this.params.requirements && this.params.saveRequirements) {
      let requirements = this.fsReadConfig(fileName);
      if (requirements.empty) {
        delete requirements.empty;
      }
      let tmp = {};
      Object.getOwnPropertyNames(this.params.requirements).forEach((cmd) => {
        const options = this.params.requirements[cmd];
        if (!options.installer) {
          tmp[cmd] = options;
        }
      });
      requirements = this.config.mergeObject(requirements, tmp);
      fs.writeFileSync(fileName, JSON.stringify(requirements, null, 2));
    }
  }
};