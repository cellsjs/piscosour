'use strict';

// Obtenemos la version del package.json de la receta de pisco
// Navegamos hasta la dependencia de functional-test
// Modificamos la version dependencia de pisco en el package.json de functional-test a la version que hemos obtenido en el punto 1
// Lanzamos los tests

var fs = require('fs');
var resolve = require('path').resolve;

var fConfigPiscoFT = '../node_modules/pisco-functional-tests/package.json';
var fConfigPiscoFTFromRootPath = './node_modules/pisco-functional-tests/package.json';

var configPisco = require('../package.json');
var configPiscoFunctionalTests = require(fConfigPiscoFT);


let previousVersion = configPiscoFunctionalTests.dependencies.piscosour;

configPiscoFunctionalTests.devDependencies.piscosour = configPisco.version;

fs.writeFile(resolve(fConfigPiscoFTFromRootPath),
  JSON.stringify(configPiscoFunctionalTests, null, 2),
  execTestsAndRewriteFile);

function execTestsAndRewriteFile(err) {
  if (err) return console.log(err);
  resolveExecution();
}

function resolveExecution(){
  configPiscoFunctionalTests.dependencies.piscosour = previousVersion;
  modifyFile(resolve(fConfigPiscoFTFromRootPath),
    JSON.stringify(configPiscoFunctionalTests, null, 2),
    callback);
}

function callback(error) {
  if (error) return console.log(error);
}

function modifyFile(path, data, callback) {
  fs.writeFile(path, data, callback);
}