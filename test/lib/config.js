'use strict';

const config = require('../../lib/config.js');
const expect = require('chai').expect;

/* global define, it, describe, before */
describe('Testing config.js', () => {
  it('Should getFlowParams return an empty object', () => {
    //Arrange
    //Act
    var params = config.getFlowParams('normalStep', 'normalFlow');
    //Assert
    expect(params).to.be.ok;
    expect(params).to.deep.equal({});
  });
});