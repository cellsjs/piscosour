'use strict';

const toolName = 'piscosour';

module.exports = {
  toolName: toolName,
  toolLocalDir: `.${toolName}`,
  toolKeyword: `${toolName}-recipe`,
  toolFile: `${toolName}.json`,
  notBuild: 'not-build',
  piscoFile: `${toolName}.json`,
  npmFolder: 'node_modules',
  npmFile: 'package.json',
  npmDependencies: ['devDependencies', 'dependencies'],
  functionalTestsKeyword: 'functional-tests',
  testLauncher: 'node_modules/.bin/mocha',
  uuid: '288b3227-ba32-440c-8651-28b44d2ecd5d'
};