'use strict';
/* global define, it, describe, before */
const assert = require('chai').assert;
const exec = require('child_process').exec;
const rimraf = require('rimraf');
const util = require('util');
const fs = require('fs');
const expect = require('pisco-test-helper').fsexpect;

/*
describe('Pisco \'app:init\' straw test', () => {

  it('Should \'app:init\' works with composer params file', (done) => {
    let testFolder = 'test/testInit1';

    rimraf(testFolder, {}, () => {
      fs.mkdir(testFolder, () => {
        exec('node ../../bin/pisco.js app:init --paramsFile ../composer_one_family.json', { cwd: testFolder }, (error, stdout, stderr) => {
          assert.equal(stderr, '', stderr);
          assert.equal(error, null, error);

          expect.file(`${testFolder}/.piscosour/piscosour.json`).exist();
          expect.file(`${testFolder}/.piscosour/piscosour.json`).have.changed();
          expect.file(`${testFolder}/.piscosour/piscosour.json`).contain('foo-app-name');
          done();
        });
      });
    });
  });

  it('Should \'app:init\' works with destination, appName and family params', (done) => {
    let testFolder = 'test/testInit2';

    rimraf(testFolder, {}, function() {
      fs.mkdir(testFolder, () => {
        exec(`node bin/pisco.js app:init --destination ${testFolder} --componentFamilies family1 --appName foo-app-name`, (error, stdout, stderr) => {
          assert.equal(stderr, '', stderr);
          assert.equal(error, null, error);

          expect.file(`${testFolder}/.piscosour/piscosour.json`).exist();
          expect.file(`${testFolder}/.piscosour/piscosour.json`).have.changed();
          expect.file(`${testFolder}/.piscosour/piscosour.json`).contain('foo-app-name');
          done();
        });
      });
    });
  });

  it('Should \'app:init\' save the module version in \'.piscosour/piscosour.json\'', (done) => {
    let testFolder = 'test/testInit3';

    rimraf(testFolder, {}, function() {
      fs.mkdir(testFolder, () => {
        exec(`node bin/pisco.js app:init --destination ${testFolder} --componentFamilies family1 --appName foo-app-name`, (error, stdout, stderr) => {
          assert.equal(stderr, '', stderr);
          assert.equal(error, null, error);

          expect.file(`${testFolder}/.piscosour/piscosour.json`).exist();
          expect.file(`${testFolder}/.piscosour/piscosour.json`).containPattern(/"appInit".*\n.*"version".*".*\..*\..*"/);
          done();
        });
      });
    });
  });

});

describe('Pisco \'app:install\' straw test', function() {

  describe('Pisco \'app:install\' should create a scaffold as expected', function() {
    let testFolder = 'test/testInstall1';
    this.timeout(50000);

    before(function(done) {
      rimraf(testFolder, {}, () => {
        fs.mkdir(testFolder, () => {
          exec(`node bin/pisco.js app:init --paramsFile test/composer_one_family.json --destination ${testFolder}`, () => {
            expect.file(`${testFolder}/.piscosour/piscosour.json`).exist();
            expect.file(`${testFolder}/.piscosour/piscosour.json`).have.changed();
            exec('node ../../bin/pisco.js app:install', { cwd: testFolder }, (error, stdout, stderr) => {
              assert.equal(stderr, '', stderr);
              assert.equal(error, null, error);
              done();
            });
          });
        });
      });
    });

    it('Should \'app/tpls/index.tpl\' be well formed', function(done) {
      expect.file(`${testFolder}/app/tpls/index.tpl`).exist();
      expect.file(`${testFolder}/app/tpls/index.tpl`).have.changed(50000);
      expect.file(`${testFolder}/app/tpls/index.tpl`).contain('<title>foo-app-name');
      expect.file(`${testFolder}/app/tpls/index.tpl`).contain('<meta name="theme-color" content="#303F9F">');
      expect.file(`${testFolder}/app/tpls/index.tpl`).contain('<meta name="msapplication-TileColor" content="#3372DF">');
      done();
    });

    it('Should \'app/elements/my-greeting/my-greeting.html\' be well formed', function(done) {
      expect.file(`${testFolder}/app/elements/my-greeting/my-greeting.html`).exist();
      expect.file(`${testFolder}/app/elements/my-greeting/my-greeting.html`).contain('<h1 class="paper-font-display1"><span>{{greeting}}</span></h1>');
      done();
    });

    it('Should \'bower.json\' be well formed', function(done) {
      expect.file(`${testFolder}/bower.json`).exist();
      expect.file(`${testFolder}/bower.json`).have.changed(50000);
      expect.file(`${testFolder}/bower.json`).contain('xxxx-buzz-ui');
      done();
    });

    it('Should \'bower components\' be installed', function(done) {
      expect.folder(`${testFolder}/components`).exist();
      done();
    });
  });

  it('Should \'app:install\' does not work without a .piscosour/piscosour.json file', (done) => {
    let testFolder = 'test/testInstall2';

    rimraf(testFolder, {}, () => {
      fs.mkdir(testFolder, () => {
        exec('node ../../bin/pisco.js app:install', { cwd: testFolder }, (error, stdout, stderr) => {
          assert.notEqual(stderr, '', 'stderr is an empty string');
          assert.notEqual(error, null, 'error is null');

          expect.file(`${testFolder}/.piscosour/piscosour.json`).not.exist();
          expect.file(`${testFolder}/app/tpls/index.tpl`).not.exist();
          done();
        });
      });
    });
  });

  it('Should \'app:install\' save the module version in \'.piscosour/piscosour.json\'', function(done) {
    let testFolder = 'test/testInstall3';
    this.timeout(50000);
    rimraf(testFolder, {}, () => {
      fs.mkdir(testFolder, () => {
        exec(`node bin/pisco.js app:init --paramsFile test/composer_no_families.json --destination ${testFolder}`, () => {
          exec('node ../../bin/pisco.js app:install', { cwd: testFolder }, (error, stdout, stderr) => {
            assert.equal(stderr, '', stderr);
            assert.equal(error, null, error);

            expect.file(`${testFolder}/.piscosour/piscosour.json`).exist();
            expect.file(`${testFolder}/.piscosour/piscosour.json`).containPattern(/"appInstall".*\n.*"version".*".*\..*\..*"/);
            done();
          });
        });
      });
    });
  });

  it('Should \'app:install\' works with no families', function(done) {
    let testFolder = 'test/testInstall4';
    this.timeout(50000);

    rimraf(testFolder, {}, () => {
      fs.mkdir(testFolder, () => {
        exec(`node bin/pisco.js app:init --paramsFile test/composer_no_families.json --destination ${testFolder}`, () => {
          exec('node ../../bin/pisco.js app:install', { cwd: testFolder }, (error, stdout, stderr) => {
            assert.equal(stderr, '', stderr);
            assert.equal(error, null, error);

            expect.file(`${testFolder}/bower.json`).exist();
            expect.file(`${testFolder}/bower.json`).have.changed(50000);
            expect.file(`${testFolder}/bower.json`).not.contain('xxxx-buzz-ui');

            expect.folder(`${testFolder}/components`).exist();
            done();
          });
        });
      });
    });
  });

  it('Should \'app:install\' works with three families', function(done) {
    let testFolder = 'test/testInstall5';
    this.timeout(50000);

    rimraf(testFolder, {}, () => {
      fs.mkdir(testFolder, () => {
        exec(`node bin/pisco.js app:init --paramsFile test/composer_three_families.json --destination ${testFolder}`, () => {
          exec('node ../../bin/pisco.js app:install', { cwd: testFolder }, (error, stdout, stderr) => {
            assert.equal(stderr, '', stderr);
            assert.equal(error, null, error);

            expect.file(`${testFolder}/bower.json`).exist();
            expect.file(`${testFolder}/bower.json`).have.changed(50000);
            expect.file(`${testFolder}/bower.json`).contain('xxxx-buzz-ui');
            expect.file(`${testFolder}/bower.json`).contain('organisms-family');
            expect.file(`${testFolder}/bower.json`).contain('molecule-components-family');

            expect.folder(`${testFolder}/components`).exist();
            done();
          });
        });
      });
    });
  });
});

describe('Pisco \'app:create\' straw test', function() {

  it('Should \'app:create\' works with composer params file', function(done) {
    let config = 'composer_app_create1.json';
    let appName = JSON.parse(fs.readFileSync(`test/${config}`, 'utf8')).appName;
    let testFolder = `test/${appName}`;
    this.timeout(50000);

    rimraf(testFolder, {}, () => {
      exec(`node ../bin/pisco.js app:create --paramsFile ${config}`, { cwd: 'test' }, (error, stdout, stderr) => {
        //assert.equal(stderr, '', stderr);
        assert.equal(error, null, error);

        expect.folder(`${testFolder}`).exist();
        expect.file(`${testFolder}/bower.json`).contain('xxxx-buzz-ui');
        expect.folder(`${testFolder}/components`).exist();
        done();
      });
    });
  });
});
*/