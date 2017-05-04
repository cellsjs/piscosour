const pisco = require('../index.js');
const assert = require('assert');
const fs = require('fs');
const describe = require('mocha').describe;
const it = require('mocha').it;


const relaunch = '.relaunch';


describe.skip('First test case for pisco', function () {
    it('Should execute correctly the function onreject (skip for process exit)',  () => {
        let e = null;
        process.on('exit', (code) => {
            assert.equal(-1, code);
        });
        pisco.onReject(e);
    });
});

describe.skip('Test case  for onFulfilled', () => {
    before(() => {
        fs.closeSync(fs.openSync(relaunch, 'w'));
    });
    it('Should launch exit code 0 when no relaunch exists', (done) => {
        fs.unlink(relaunch, (error) => {
            if (error) throw error;
            console.log('Deleted relaunch');
        });
        process.on('exit', (code) => {
            console.log('Exist with code ', code);
            assert.equal(0, code);
            done();
        });
        pisco.onFulfilled();
        assert.ok('Ha ido OK');
        done();
    });
    it.skip('Should return normally', (done) => {
        process.on('exit', (code) => {
            assert.equal(-1, code);
        });
        pisco.onFulfilled();
        assert.ok('Ha ido OK');
        done();
    });
});
