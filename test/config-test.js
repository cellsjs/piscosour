'use strict';

const config = require('../lib/config.js');
const assert = require('assert');
const describe = require('mocha').describe;
const it = require('mocha').it;

describe("Testing config.js", () => {
    it("Get params", () => {
        //Arrange
        //Act
        var params = config.getFlowParams("normalStep", "normalFlow");
        //Assert
        assert.ok(params, "Params not null");
        assert.ok(JSON.stringify(params) === '{}', "Params not empty " + JSON.stringify(params));
    });
});