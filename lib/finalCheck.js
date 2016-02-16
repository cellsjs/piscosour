/*jshint node:true */

'use strict';

var path = require("path"),
    config = require("./config"),
    params = require("./params"),
    fs = require('fs'),
    fsUtils = require("./utils/fsUtils"),
    junitGen = require("./utils/junit"),
    xml = require('xml'),
    logger = require("./logger");

var check = function() {

    var run = function(){
        logger.info("#magenta","finalCheck...");
        var junit = getJunit();
        if (params.junitReport)
            writeJunitXml(junit);
        return junit.testsuites[0]._attr.errors===0 && junit.testsuites[0]._attr.faliures===0;
    };

    var writeJunitXml = function(junit){
        var file = path.join(config.junitDir, "pisco-unit.xml");
        logger.info("#magenta","Write results in junit format at", file);

        fsUtils.createDir(config.junitDir);

        var content = xml(junit, {indent:"  "});
        logger.txt(content);
        //fs.writeFileSync(file,content);
    }


    var getJunit = function(){
        var junit = junitGen.template();

        junit.testsuites[0]._attr.name = "Execution of "+(params.shot?"shot":"straw")+": ( "+config.cmd+" "+params.normal.repoType+":"+params.normal.name+" )";
        if (params.shot){
            junit.testsuites.push(shot2Testsuite(global[params.normal.name]["xxreport"]));
        }else{
            setStraw(junit, params.normal.name);
        }
        return junit;
    };

    var setStraw = function(junit, strawName){
        for (var name in config.straws[strawName].shots){
            if (config.straws[strawName].shots[name].type==='straw'){
                setStraw(junit,name);
            }else if (global[name] && global[name]["xxreport"])
                junit.testsuites.push(shot2Testsuite(global[name]["xxreport"]));
        }
    }

    var shot2Testsuite = function(report){
        var testsuite = junitGen.testsuite();
        testsuite.testsuite[0]._attr.name=report.name+" ("+report.description+")";
        testsuite.testsuite[0]._attr.timestamp=report.timestamp;
        testsuite.testsuite[0]._attr.time=report.time;

        logger.info("report",report);

        for (var i in report.results){
            var result = report.results[i];
            var testcase = junitGen.testcase();

            testcase.testcase[0]._attr.name = result.message;
            testcase.testcase[0]._attr.classname = params.normal.repoType+":"+params.normal.name+":"+report.name;
            testcase.testcase[0]._attr.time = result.time;

            if (result.content) {
                if (result.content.skipped)
                    testcase.testcase.push({skipped: undefined});
                if (result.content.error) {
                    if (result.content.keep)
                        testcase.testcase.push({failure: result.content.error});
                    else
                        testcase.testcase.push({error: result.content.error?result.content.error:result.content});
                }
            }
            logger.info("result",result);
            testsuite.testsuite.push(testcase);
        }
        return testsuite;
    };

    return {
        run: run,
    }
}

module.exports = check();