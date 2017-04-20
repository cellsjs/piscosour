'use strict';

// Obtenemos la version del package.json de la receta de pisco
// Navegamos hasta la dependencia de functional-test
// MOdificamos la version dependencia de pisco en el package.json de functional-test a la verion que hemos obtenido en el punto 1
// Lanzamos los tests

var exec = require('child_process').exec;
var fs = require('fs');
var resolve = require('path').resolve;

var configPisco = require('../package.json');
var fConfigPiscoFT = '../node_modules/pisco-functional-tests/package.json';
var fConfigPiscoFTFromRootPath = './node_modules/pisco-functional-tests/package.json';
var configPiscoFunctionalTests = require(fConfigPiscoFT);

let previousVersion = configPiscoFunctionalTests.dependencies.piscosour;
console.log(`Version pisco: ${configPisco.version}`);
console.log(`Version pisco-functional-tests: ${previousVersion}`);

configPiscoFunctionalTests.dependencies.piscosour = configPisco.version;

fs.writeFile(resolve(fConfigPiscoFTFromRootPath),
  JSON.stringify(configPiscoFunctionalTests),
  execTestsAndRewirteFile);

function execTestsAndRewirteFile(err) {
  if (err) return console.log(err);
  console.log(JSON.stringify(configPiscoFunctionalTests));
  console.log('writing to ' + fConfigPiscoFTFromRootPath);
  exec('env PISCO=\"`pwd`/bin/pisco.js\" mocha -u tdd --recursive ' +
    './node_modules/pisco-functional-tests/test;',
    resolveExecution);
}

function resolveExecution(error, stdout, stderr){
  console.log(stderr);
  console.log(error);
  console.log(stdout);
  configPiscoFunctionalTests.dependencies.piscosour = previousVersion;
  modifyFile(resolve(fConfigPiscoFTFromRootPath),
    JSON.stringify(configPiscoFunctionalTests),
    callback);
}

function callback(error) {
  if (error) return console.log(error);
  console.log(JSON.stringify(configPiscoFunctionalTests));
  console.log('writing to ' + fConfigPiscoFTFromRootPath);
}


function modifyFile(path, data, callback) {
  fs.writeFile(path, data, callback);
}