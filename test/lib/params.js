'use strict';

const params = require('../../lib/params');
const expect = require('chai').expect;

/* global define, it, describe, before */
describe('Params file', () => {
  it('Should get all the configuration', () => {
    // Act
    // Assert
    expect(params).to.not.null;
  });
  it('Should merge the configuration (merge function)', () => {
    // Arrange
    const configToMerge = {
      house: {
        rooms: 3
      },
      car: {
        engine: {
          power: 110
        },
        dors: 4,
        change: 'automated'
      }
    };
    // Act
    const configMerged = params.merge(configToMerge);
    // Assert
    expect(configMerged).to.include.all.deep.keys('house', 'car');
  });
  it('Should info the configuration (info function) for list param', () => {
    // Act
    const paramsInfo = params.info('list');
    // Assert
    expect(paramsInfo).to.include('recipes');
    expect(paramsInfo).to.include('-la');
  });
  it('Should check the knownOpts param (defaultString implicit)', () => {
    // Act
    const knownOpts = params.knownOpts;
    // Assert
    expect(knownOpts).to.include.all.deep.keys(['version', 'list', 'paramsFile']);
  });
  it('Should check the commands param', () => {
    // Act
    const commands = params.commands;
    // Assert
    expect(commands).to.ok;
  });
});