'use strict';

const path = require('path');
const fs = require('fs');

const logger = require('./logger');
const search =  require('./utils/search');
const fsUtils =  require('./utils/fsUtils');
const launcher = require('./utils/launcher');
const constants = require('./utils/constants');
const Waterfall = require('./utils/waterfall');

const tests = {
  run(ok, ko){
    const executable = path.join(process.cwd(), 'bin', 'pisco.js');

    if (fsUtils.exists(executable)) {
      const testModules = search.searchByKeyword(constants.functionalTestsKeyword);
      logger.info('Number of functional testing modules detected: ', '#green', testModules.length);
      const promises = [];
      const pkg = fsUtils.readConfig(constants.npmFile);

      const writeVersion = (module) => {
        const dest = path.join(constants.npmFolder, module.name, constants.npmFile);
        const destPkg = fsUtils.readConfig(dest);
        destPkg.devDependencies = destPkg.devDependencies ? destPkg.devDependencies : {};
        destPkg.devDependencies.piscosour = pkg.version;
        fs.writeFileSync(dest, JSON.stringify(destPkg, null, 2));
      };

      const execute = (module, cmd, args, options) => {
        logger.info('Executing piscosour functional tests from', '#cyan', module.name, '(', '#green', module.version, ')');
        return launcher.execute(cmd, args, options);
      };

      process.env.piscoExec = `${process.execPath} ${executable} --uuid ${constants.uuid}`;

      testModules.forEach((module) => {
        if (pkg.name === constants.toolName) {
          writeVersion(module);
        }
        promises.push({
          fn: execute,
          args: [module, constants.testLauncher, ['-u', 'tdd', '--recursive', path.join(constants.npmFolder, module.name, 'test')], {stdio: [process.stdin, process.stdout, process.stderr]}],
          obj: this
        });
      });
      const waterfall = new Waterfall({
        promises: promises,
        logger: logger
      });
      waterfall.start().then(ok, ko);
    } else {
      logger.info('There is no executable', '#cyan', executable, '\n\n', '#yellow', 'Go to the root of a recipe and execute tests again.\n');
    }
  }
};

module.exports = tests;