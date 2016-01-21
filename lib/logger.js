/*jshint node:true */

'use strict';

var moment = require('moment'),
    params = require('./params'),
    chalk = require('chalk');

var levels = {
    "verbose": 3,
    "info": 2,
    "warning": 1,
    "error": 0,
    "default" : 2
};

var gLevel = levels[params.level];

if (!gLevel)
    gLevel = levels["default"];

var logger = {

    //TODO: concatenar estilos de chalk red + bold (etc..)
    prettyPrint: function () {
        var args = Array.prototype.slice.call(arguments);
        var res = ["[" + chalk.grey(moment().format("HH:mm:ss")) + "]"];
        var color;
        for (var con in args[0]) {
            var item = args[0][con];
            if (item && typeof item === 'string' && item.charAt(0) === '#')
                color = item.replace('#', '');
            else {
                if (color){
                    item = chalk[color](item);
                    color = null;
                }
                res.push(item);
            }
        }
        return res;
    },
    out :function(){
        process.stdout.write.apply(process.stdout,arguments);
    },
    err :function(){
        process.stderr.write.apply(process.stderr,arguments);
    },
    txt : function(){
        console.log.apply(this,arguments);
    },
    traceError: function () {
        console.trace.apply(this,this.prettyPrint(arguments));
    },
    error: function () {
        console.error.apply(this,this.prettyPrint(arguments));
    },
    warn: function () {
        if (gLevel >= 1)
            console.info.apply(this,this.prettyPrint(arguments));
    },
    info: function () {
        if (gLevel >= 2)
            console.info.apply(this,this.prettyPrint(arguments));
    },
    trace: function () {
        if (gLevel >= 3)
            console.info.apply(this,this.prettyPrint(arguments));
    },
    //Gulp events formatter
    event: function (event) {
        this.trace("#green", "logger:event","parsing gulp event:","#magenta", JSON.stringify(event));
        switch (event.src) {
            case "start":
                this.info("(","#green",event.src,") Starting sequence:" , chalk.cyan(event.message));
                break;
            case "stop":
                this.info("(","#green",event.src,") Finished:" , chalk.cyan(event.message));
                break;
            case "task_start":
                this.info("(","#green",event.src,") Starting task:" , chalk.cyan(event.task) , " - " , event.message);
                break;
            case "task_stop":
                this.info("(","#green",event.src,") Finished task:" , chalk.cyan(event.task) , " - " , event.message, "after" , chalk.magenta(event.duration));
                break;
            case "task_err":
                this.error("(","#green",event.src,") Error:" , chalk.red(event.err.message) , " in task " , chalk.cyan(event.task) , " - plugin: " , chalk.green(event.err.plugin), "after" , chalk.magenta(event.duration));
                break;
            case "err":
                this.error("(","#green",event.src,") Error:" , chalk.red(event.err.message) , " - plugin: " , chalk.green(event.err.plugin));
                break;
            default:
                this.error("#red","Unknow event:", event);
        }
    }
};

module.exports = logger;