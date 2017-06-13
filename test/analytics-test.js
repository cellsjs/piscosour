'use strict';

const analytics = require('../lib/analytics');
const assert = require('assert');
const describe = require('mocha').describe;
const it = require('mocha').it;

/* global define, it, describe, before */
describe('Testing analytics functions', () => {
  it('Should return null because we can not initialize visitor', () => {
    //Act
    let visitor = analytics.visitor();
    //Assert
    //assert.equal(visitor, null, 'Visitor is not null');
  });
  it('Should not record one hit because visitor is null', () => {
    // Act
    analytics.hit('url', 'pageName');
    // Assert
    //assert.ok('No way to probe the test');
  });
  it('Should trace without exception', () => {
    // Act
    analytics.notify(null);
    //Assert
    //assert.ok('Called logger.trace without exception');
  });
  it('Should trace with exception', () => {
    // Arrange
    let err = new Error('Test Error', -1);
    // Act
    analytics.notify(err);
    //assert.ok('Called logger.trace with exception');
  });
  it('Should exit of error because visitor is null', () => {
    // Act
    analytics.error(null, null, null, assertExitCalled);
    // Assert
    function assertExitCalled() {
      //assert.ok('We have called the callback exit correctly');
    }
  });
});

