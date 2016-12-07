'use strict';

const path = require('path');
const config = require('./config');
const params = require('./params');
const moment = require('moment');
const fs = require('fs');
const fsUtils = require('./utils/fsUtils');
const junitGen = require('./utils/junit');
const xml = require('xml');
const logger = require('./logger');

/**
 *
 * This module check all the information stored during the execution.
 * If -u option is passed to the CLI junit.xml file is generated in this module.
 * @returns true if there was no error in the execution
 * @module FinalCheck
 */
module.exports = (function() {

  const _pad = function(num, size) {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  };

  const formatError = function(content) {
    let formatted = '';
    const keys = ['data', 'error', 'stack', 'stderr'];

    for (const idx in keys) {
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

  const toJunitTime = function(milis) {
    return milis / 1000;
  };

  const writeJunitXml = function(junit) {
    const _config = config.get();
    process.chdir(_config.rootDir);
    const file = path.join(_config.junitDir, _config.junitPiscoFile);
    logger.info('#magenta', 'Write results in junit format at', file);

    fsUtils.createDir(_config.junitDir);

    const content = xml(junit, {indent: '  '});
    fs.writeFileSync(file, content);
  };

  const step2Testsuite = function(junit, report) {
    const testsuite = junitGen.testsuite();
    testsuite.testsuite[0]._attr.name = report.name;
    testsuite.testsuite[0]._attr.timestamp = report.timestamp;
    testsuite.testsuite[0]._attr.time = toJunitTime(report.time);

    report.results.forEach((result) => {
      const testcase = junitGen.testcase();

      testcase.testcase[0]._attr.name = report.description + ' (' + result.message + ')';
      testcase.testcase[0]._attr.classname = _pad(result.order, 3) + '-' + report.context + ':' + params.normal.name + ':' + report.name;
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

  const setFlow = function(junit, normal) {
    const flow = config.getFlow(normal);
    for (const name in flow.steps) {
      if (flow.steps[name].type === 'flow') {
        normal.name = name;
        setFlow(junit, normal);
      } else if (global[name]) {
        for (const ctx in global[name]) {
          if (global[name][ctx].xxreport) {
            junit.testsuites.push(step2Testsuite(junit, global[name][ctx].xxreport));
          }          
        }
      }
    }
  };

  const getJunit = function(init) {
    const junit = junitGen.template();

    junit.testsuites[0]._attr.name = 'Execution of ' + (params.normal.isStep ? 'step' : 'flow') + ': ( ' + config.get().cmd + ' ' + params.normal.context + ':' + params.normal.name + ' )';
    junit.testsuites[0]._attr.time = toJunitTime((moment() - init));

    if (params.normal.isStep) {
      junit.testsuites.push(step2Testsuite(junit, global[params.normal.name].xxreport));
    } else {
      setFlow(junit, params.normal);
    }

    return junit;
  };

  /**
   * Module interface
   *
   * @returns {boolean}
   * @param init
   */
  const run = function(init) {
    const junit = getJunit(init);
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