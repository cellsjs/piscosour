'use strict';

var assert = require('assert'),
    config = require('../config'),
    params = require('../params');
var executionName = (params.shot?"shot":"straw")+" ( "+params.normal.repoType+":"+params.normal.name+" )";

var writeReport = function(report){
    describe("shot:"+report.name+" ("+report.description+")", function() {
        for (var i in report.results){
            var result = report.results[i];
            if ((! result.content) || !result.content.skipped) {
                if (result.status!==0) {
                    it(result.message, function () {
                        assert.ok(false);
                    });
                } else {
                    it(result.message, function () {
                        assert.ok(true);
                    });
                }
            }
        }
    });
};

describe('Piscosour '+executionName, function() {
    if (params.shot){
        writeReport(global[params.normal.name]["xxreport"]);
    }else{
        //TODO: shot de tipo straw
        for (var name in config.straws[params.normal.name].shots){
            if (global[name] && global[name]["xxreport"])
                writeReport(global[name]["xxreport"]);
        }
    }
});