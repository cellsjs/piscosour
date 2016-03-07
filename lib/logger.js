/*jshint node:true */

'use strict';

var moment = require('moment'),
    params = require('./params'),
    path = require('path'),
    chalk = require('chalk');

var levels = {
    silly: 5,
    debug: 4,
    verbose: 3,
    info: 2,
    warning: 1,
    error: 0,
    default : 2
};

var getPkg = function(){
    var objPath = path.parse(process.mainModule.filename);
    var moduleDir =  objPath.dir.substring(0,objPath.dir.lastIndexOf('/'));
    return require(path.join(moduleDir,'package.json'));
}

var gLevel = levels[params.output];

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
    debug: function () {
        if (gLevel >= 4)
            console.info.apply(this,this.prettyPrint(arguments));
    },
    silly: function () {
        if (gLevel >= 5)
            console.info.apply(this,this.prettyPrint(arguments));
    }
};

module.exports = logger;