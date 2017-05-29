'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;
const chef = require('../lib/chef.js')
const assert = require('assert');

var async = require('async');

/* global define, it, describe, before */
describe('Testing chef.js file', () => {
  it('Should return ok', () => {
    //Arrange
    async.eachSeries
    //Act
    let recipes = chef.getRecipes(false);
    //Assert
    assert.notEqual(recipes, null, 'Checking the recipes after getRecipes of chef');
  });
});
