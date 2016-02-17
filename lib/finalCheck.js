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

    var run = function(init){
        logger.info("#magenta","finalCheck...");
        var junit = getJunit(init);
        if (params.junitReport)
            writeJunitXml(junit);
        return (junit.testsuites[0]._attr.errors===0 && junit.testsuites[0]._attr.faliures===0);
    };

    var writeJunitXml = function(junit){
        var file = path.join(config.junitDir, config.junitPiscoFile);
        logger.info("#magenta","Write results in junit format at", file);

        fsUtils.createDir(config.junitDir);

        var content = xml(junit, {indent:"  "});
        fs.writeFileSync(file,content);
    }


    var getJunit = function(init){
        var junit = junitGen.template();

        junit.testsuites[0]._attr.name = "Execution of "+(params.shot?"shot":"straw")+": ( "+config.cmd+" "+params.normal.repoType+":"+params.normal.name+" )";
        junit.testsuites[0]._attr.time = new Date().getTime()-init;

        if (params.shot){
            junit.testsuites.push(shot2Testsuite(junit,global[params.normal.name]["xxreport"]));
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
                junit.testsuites.push(shot2Testsuite(junit, global[name]["xxreport"]));
        }
    }

    var shot2Testsuite = function(junit, report){
        var testsuite = junitGen.testsuite();
        testsuite.testsuite[0]._attr.name=report.name+" ("+report.description+")";
        testsuite.testsuite[0]._attr.timestamp=report.timestamp;
        testsuite.testsuite[0]._attr.time=report.time;

        for (var i in report.results){
            var result = report.results[i];
            var testcase = junitGen.testcase();

            testcase.testcase[0]._attr.name = result.message;
            testcase.testcase[0]._attr.classname = params.normal.repoType+":"+params.normal.name+":"+report.name;
            testcase.testcase[0]._attr.time = result.time;

            testsuite.testsuite[0]._attr.tests++;
            junit.testsuites[0]._attr.tests++;

            if (result.content) {
                if (result.content.skipped)
                    testcase.testcase.push({skipped: undefined});
                if (result.status!==0) {
                    if (result.content.keep) {
                        testcase.testcase.push({faliure: result.content.error});
                        testsuite.testsuite[0]._attr.faliures++;
                        junit.testsuites[0]._attr.faliures++;

                    }else {
                        testcase.testcase.push({error: result.content.error ? result.content.error : result.content});
                        testsuite.testsuite[0]._attr.errors++;
                        junit.testsuites[0]._attr.errors++;
                    }
                }else{
                    if (result.content)
                        testcase.testcase.push({"system-out": result.content});
                }
            }
            testsuite.testsuite.push(testcase);
        }
        return testsuite;
    };

    return {
        run: run,
    }
}

module.exports = check();