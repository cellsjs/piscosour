/*jshint node:true */

'use strict';

var moment = require('moment'),
    params = require('./params'),
    fs = require('fs'),
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
                    if (color === 'duration')
                        item = chalk.cyan(moment.utc(item).format(logger.duration(item)));
                    else
                        item = chalk[color](item);
                    color = null;
                }
                res.push(item);
            }
        }
        return res;
    },
    duration: function (milis) {
        var pattern = "SSS [ms]";
        if (milis>=1000 && milis<60000)
            pattern = "ss [s] SSS [ms]";
        else if (milis>=60000 && milis<3600000)
            pattern = "mm [m] ss [s] SSS [ms]";
        else if (milis>=3600000)
            pattern = "hh [h] mm [m] ss [s] SSS [ms]";
        return pattern;
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
    },
    parseMd : function(){
        var args = Array.prototype.slice.call(arguments);
        var txt;
        args.forEach(function (file) {
            var buffer;
            try {
                buffer = fs.readFileSync(file);
                txt = buffer.toString();
                return;
            } catch (e) {
                this.trace("Error reading", file, e);
                if (!txt) txt = "";
                else txt += "\n";
                txt += file + " doesn't exists!";
            }
        }.bind(this));
        this.txt(txt);
    }
};

module.exports = logger;