'use strict';

/**
 *
 * This module check all the information stored during the execution.
 * If -u option is passed to the CLI junit.xml file is generated in this module.
 * @returns true if there was no error in the execution
 * @module FinalCheck
 */
module.exports = (function() {

  let path = require('path');
  let config = require('./config');
  let params = require('./params');
  let moment = require('moment');
  let fs = require('fs');
  let fsUtils = require('./utils/fsUtils');
  let junitGen = require('./utils/junit');
  let xml = require('xml');
  let logger = require('./logger');

  var formatError = function(content) {
    let formatted = '';
    let keys = ['data', 'error', 'stack', 'stderr'];

    for (let idx in keys) {
      if (content[keys[idx]]) {
        formatted += `${content[keys[idx]]}`;
        break;
      }
    }
    if (formatted.length === 0) {
      formatted = content;
    }
    return formatted;
  };

  var toJunitTime = function(milis) {
    return milis / 1000;
  };

  var writeJunitXml = function(junit) {
    process.chdir(config.rootDir);
    var file = path.join(config.junitDir, config.junitPiscoFile);
    logger.info('#magenta', 'Write results in junit format at', file);

    fsUtils.createDir(config.junitDir);

    var content = xml(junit, {indent: '  '});
    fs.writeFileSync(file, content);
  };

  var shot2Testsuite = function(junit, report) {
    var testsuite = junitGen.testsuite();
    testsuite.testsuite[0]._attr.name = report.name;
    testsuite.testsuite[0]._attr.timestamp = report.timestamp;
    testsuite.testsuite[0]._attr.time = toJunitTime(report.time);

    report.results.forEach((result) => {
      var testcase = junitGen.testcase();

      testcase.testcase[0]._attr.name = report.description + ' (' + result.message + ')';
      testcase.testcase[0]._attr.classname = result.order + '-' + params.normal.repoType + ':' + params.normal.name + ':' + report.name;
      testcase.testcase[0]._attr.time = toJunitTime(result.time);

      if (result.content) {
        if (result.content.skipped) {
          testcase.testcase.push({skipped: undefined});
        }
        if (result.status !== 0) {
          if (result.content.keep) {
            testcase.testcase.push({failure: {_cdata: formatError(result.content)}});
            testsuite.testsuite[0]._attr.failures++;
            junit.testsuites[0]._attr.failures++;
          } else {
            testcase.testcase.push({error: {_cdata: formatError(result.content)}});
            testsuite.testsuite[0]._attr.errors++;
            junit.testsuites[0]._attr.errors++;
          }
        } else {
          if (result.content) {
            testcase.testcase.push({'system-out': result.content});
          }
        }
      }
      if (!result.content || !result.content.skipped) {

        testsuite.testsuite[0]._attr.tests++;
        junit.testsuites[0]._attr.tests++;
        testsuite.testsuite.push(testcase);
      }
    });
    return testsuite;
  };

  var setStraw = function(junit, normal) {
    var straw = config.getStraw(normal);
    for (var name in straw.shots) {
      if (straw.shots[name].type === 'straw') {
        normal.name = name;
        setStraw(junit, normal);
      } else if (global[name] && global[name].xxreport) {
        junit.testsuites.push(shot2Testsuite(junit, global[name].xxreport));
      }
    }
  };

  var getJunit = function(init) {
    var junit = junitGen.template();

    junit.testsuites[0]._attr.name = 'Execution of ' + (params.normal.isShot ? 'shot' : 'straw') + ': ( ' + config.cmd + ' ' + params.normal.repoType + ':' + params.normal.name + ' )';
    junit.testsuites[0]._attr.time = toJunitTime((moment() - init));

    if (params.normal.isShot) {
      junit.testsuites.push(shot2Testsuite(junit, global[params.normal.name].xxreport));
    } else {
      setStraw(junit, params.normal);
    }

    return junit;
  };

  /**
   * Module interface
   *
   * @returns {boolean}
   * @param init
   */
  var run = function(init) {
    var junit = getJunit(init);
    if (params.junitReport) {
      writeJunitXml(junit);
    }
    logger.info('Total time', '-', '#duration', moment() - init);
    return (junit.testsuites[0]._attr.errors === 0 && junit.testsuites[0]._attr.failures === 0);
  };

  return {
    run: run
  };
}());