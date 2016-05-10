'use strict';

let path = require('path');
let fs = require('fs');

module.exports = {

  check: function(go, stop) {
    this.logger.info('#magenta', 'check', 'Check if this is a nodejs module');
    if (this.ctxIs('recipe')) {
      stop('This is already a piscosour recipe');
    } else {
      this.inquire('promptsPisco').then(go);
      return true;
    }
  },

  modifyPkg: function() {
    this.logger.info('#cyan', 'Modify', 'package.json');
    let pkg = this.fsReadConfig(this.pkgFile);
    if (!pkg.keywords) {
      pkg.keywords = [];
    }

    pkg.keywords.push('piscosour-recipe');
    if (!pkg.bin) {
      pkg.bin = {};
    }

    pkg.bin[this.params.cmd] = 'bin/pisco.js';

    fs.writeFileSync(this.pkgFile, JSON.stringify(pkg, null, 4));
  },

  writePiscosour: function() {
    this.logger.info('#cyan', 'Write', 'piscosour.json');
    var piscosour = {
      'cmd': this.params.cmd,
      'repoTypes': []
    };
    fs.writeFileSync('piscosour.json', JSON.stringify(piscosour, null, 4));
  },

  config: function() {
    this.logger.info('#magenta', 'config', 'Configurating package.json');
    this.runner.modifyPkg();
    this.runner.writePiscosour();
  },

  run: function(resolve, reject) {
    this.logger.info('#magenta', 'run', 'Install piscosour dependency');
    this.sh('npm install piscosour --save', reject, true);

    this.logger.info('#magenta', 'run', 'Copying files to node module');

    var origin = path.join(this.config.getDir('piscosour'), 'templates', 'bin', 'pisco_');
    var dest = path.join(this.config.rootDir, 'bin');
    var destFile = path.join(dest, 'pisco.js');
    this.fsCreateDir(dest);

    return this.fsCopyFileFiltered(origin, destFile).then(resolve, reject);
  },

  prove: function(resolve, reject) {
    this.logger.info('#magenta', 'prove', 'Prove that the new pisco recipe is executable');
    var result = this.sh('node bin/pisco.js -a', reject);

    if (result.status !== 0) {
      this.logger.error('#red', 'Error: commnad not executed propelly!', result.stderr.toString());
    }
  }
};