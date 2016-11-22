'use strict';

// Plugins: ['launcher', 'piscosour', 'fsutils']

const fs = require('fs');

module.exports = {

  //TODO: Mejorar esto 1) guardar el resultado en una variable global en lugar de escribir en disco 2) detectar (this.isLast) el último shot del straw y escribir entonces
  'core-check': function() {
    const fileName = 'requirements.json';
    let requirements = {};
    if (this.params.requirements && this.params.saveRequirements) {
      requirements = this.fsReadConfig(fileName);
      if (requirements.empty) {
        delete requirements.empty;
      }
      let tmp = {};
      const reqTmp = this.piscoConfig.mergeObject(this.params.versions, this.params.requirements);
      Object.getOwnPropertyNames(this.params.requirements).forEach((cmd) => {
        const options = reqTmp[cmd];
        if (!options.installer) {
          tmp[cmd] = options;
        }
      });
      requirements = this.piscoConfig.mergeObject(requirements, tmp);
    }
    fs.writeFileSync(fileName, JSON.stringify(requirements, null, 2));
  }
};
