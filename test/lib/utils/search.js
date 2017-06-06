'use strict';

const expect = require('chai').expect;
const search = require('../../../lib/utils/search');

/* global define, it, describe, before */
describe('Search library', () => {
  const filter = (module, options) => {
    if (module.keywords && module.keywords.indexOf(options.keyword) >= 0) {
      return module.name;
    }
  };
  it('Should search get 0 results with keyword piscosour', () => {
    //Arrange
    const options = {keyword: 'piscosour'};
    //Act
    const result = search.searchNpm(filter, options);
    //Assert
    expect(result).to.be.empty;
  });
  it('Should search get some results with keyword bdd (mocha library)', () => {
    //Arrange
    const options = {keyword: 'bdd'};
    //Act
    const result = search.searchNpm(filter, options);
    //Assert
    expect(result).to.not.be.empty;
    expect(result).to.contain('mocha');
  });
});