'use strict';

/*
 <?xml version="1.0" encoding="UTF-8"?>
 <testsuites disabled="" errors="" failures="" name="" tests="" time="">
 <testsuite disabled="" errors="" failures="" hostname="" id="" name="" package="" skipped="" tests="" time="" timestamp="">
 <properties>
 <property name="" value=""/>
 </properties>
 <testcase assertions="" classname="" name="" time="" status="">
 <skipped/>
 <error message="" type=""/>
 <failure message="" type=""/>
 <system-out/>
 <system-err/>
 </testcase>
 <system-out/>
 <system-err/>
 </testsuite>
 </testsuites>
 */

const junit = function() {

  const testcase = function() {
    return {
      testcase: [
        {
          _attr: {
            time: 0
          }
        }
      ]
    };
  };

  const testsuite = function() {
    return {
      testsuite: [
        {
          _attr: {
            tests: 0,
            failures: 0,
            errors: 0,
            warnings: 0,
            time: 0
          }
        }
      ]
    };
  };

  const template = function() {
    return {
      testsuites: [
        {
          _attr: {
            tests: 0,
            errors: 0,
            failures: 0,
            warnings: 0,
            time: 0
          }
        }
      ]
    };
  };


  return {
    template: template,
    testsuite: testsuite,
    testcase: testcase
  };
};

module.exports = junit();