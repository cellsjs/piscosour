'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;
const bus = require('../lib/bus.js');
const assert = require('assert');

describe.skip('Testing the bus.js file', () => {
    it('Should emit correctly', () => {
        //Arrange
        //Act
        let busOut = bus.emit();
        //Assert
        assert.ok(busOut, 'Getting the bus from emit');
        assert.ok(busOut.on, 'Getting the on function property from the bus');
        assert.ok(busOut.emit, 'Getting the emit function property from the bus');
    })
    it.skip('Should execute on correctly', () => {
        //Arrange
        //Act
        let busOut = bus.on(assertExitCalled);
        //Assert
        assert.ok(busOut, 'Getting the bus from emit');
        function assertExitCalled() {
            assert.ok('We have called the callback exit correctly');
        }
        assert.ok(busOut.on, 'Getting the on function property from the bus');
        assert.ok(busOut.emit, 'Getting the emit function property from the bus');
    })
})
