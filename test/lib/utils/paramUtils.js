'use strict';

const paramUtils = require('../../../lib/utils/paramUtils');
const expect = require('chai').expect;

describe('ParamUtils library', () => {
  const MODELO_AUDI = 'audi';
  const MODELO_FORD = 'ford';
  const COCHE_NAME = "nombreDelCoche";
  const POTENCIA = 110;
  const AUTOMATICO = 'automatico';
  it('Should generate an object with nested properties (empty input object)', () => {
    //Arrange
    //Act
    const result = paramUtils.refactorObjectsFromCommandLine({}, 'coche.modelo', MODELO_AUDI);
    //Assert
    expect(result.coche.modelo).to.equal(MODELO_AUDI);
  });
  it('Should merge the input object. Not colision in properties object', () => {
    //Arrange
    const inputObject = {
      coche: {
        nombre: COCHE_NAME
      }
    };
    //Act
    const result = paramUtils.refactorObjectsFromCommandLine(inputObject, 'coche.modelo', MODELO_AUDI);
    //Assert
    expect(result.coche.modelo).to.equal(MODELO_AUDI);
    expect(result.coche.nombre).to.equal(COCHE_NAME);
  });
  it('Should merge the input object and set the input paramter in case of colision', () => {
    //Arrange
    const inputObject = {
      coche: {
        nombre: COCHE_NAME,
        modelo: MODELO_FORD
      }
    };
    //Act
    const result = paramUtils.refactorObjectsFromCommandLine(inputObject, 'coche.modelo', MODELO_AUDI);
    //Assert
    expect(result.coche.modelo).to.equal(MODELO_AUDI);
    expect(result.coche.nombre).to.equal(COCHE_NAME);
  });
  it('Should merge the input object and set the input paramter in case of colision. Should respect nested object properties', () => {
    //Arrange
    const inputObject = {
      coche: {
        nombre: COCHE_NAME,
        modelo: MODELO_FORD,
        motor: {
          caballos: POTENCIA
        }
      }
    };
    //Act
    const result = paramUtils.refactorObjectsFromCommandLine(inputObject, 'coche.modelo', MODELO_AUDI);
    //Assert
    expect(result.coche.modelo).to.equal(MODELO_AUDI);
    expect(inputObject.coche.modelo).to.equal(MODELO_FORD);
    expect(result.coche.nombre).to.equal(COCHE_NAME);
    expect(result.coche.motor.caballos).to.equal(POTENCIA);
  });
  it('Should generate new nested object insides', () => {
    //Arrange
    const inputObject = {
      coche: {
        nombre: COCHE_NAME,
        modelo: MODELO_FORD,
        motor: {
          caballos: POTENCIA
        }
      }
    };
    //Act
    const result = paramUtils.refactorObjectsFromCommandLine(inputObject, 'coche.caracteristicas.cambio', AUTOMATICO);
    //Assert
    expect(result.coche.modelo).to.equal(MODELO_FORD);
    expect(result.coche.nombre).to.equal(COCHE_NAME);
    expect(result.coche.motor.caballos).to.equal(POTENCIA);
    expect(result.coche.caracteristicas.cambio).to.equal(AUTOMATICO);
    expect(inputObject.coche.caracteristicas).to.equal(undefined);
  });
});