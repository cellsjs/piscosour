'use strict';

const context = require('../../../plugins/context/index');
const expect = require('chai').expect;

/* global define, it, describe, before */
describe('Functions of context plugin', () => {
  it('Should search all the dependencies and get 0 results', () => {
    // Act
    var result = context.addons.searchNpm('piscosour-example');
    //Assert
    expect(result).to.be.empty;
  });
  it('Should search all the dependencies and get mocha', () => {
    // Act
    var result = context.addons.searchNpm('bdd');
    // Assert
    expect(result).to.not.be.empty;
    expect(result[0].name).to.contain('mocha');
  });
});