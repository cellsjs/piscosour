/*jshint node:true */

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

var junit = function() {

    var testcase = function(){
        return {
            testcase: [
                {
                    _attr: {
                        classname: "",
                        name: "",
                        time: 0
                    }
                }
            ]
        }
    };

    var testsuite = function(){
        return {
            testsuite : [
                {
                    _attr:{
                        disabled: false,
                        skipped: false,
                        tests:0,
                        faliures:0,
                        //hostname: "",
                        //id: "",
                        name:"",
                        //package: "",
                        time:0,
                        timestamp:""
                    }
                }
            ]
        }
    };

    var template = function(){
        return {
            testsuites : [
                {
                    _attr:{
                        disabled:false,
                        tests:0,
                        faliures:0,
                        name:"",
                        time:0
                    }
                }
            ]
        }
    };


    return {
        template: template,
        testsuite: testsuite,
        testcase: testcase,
    }
}

module.exports = junit();