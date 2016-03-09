/*jshint node:true */

'use strict';

var Shot = require("./lib/shot"),
    logger = require("./lib/logger"),
    config = require("./lib/config"),
    params = require("./lib/params"),
    fsUtils = require("./lib/utils/fsUtils"),
    Sour = require("./lib/sour");

const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const notifier = updateNotifier({pkg, updateCheckInterval: 1000 * 60 * 60 * 12});

/**
 * <h1>Piscosour</h1>
 *
 * <ol>
 * <li>Piscosour gets all command line (CLI) development tools wrapped-up, creating command line workflows.</li>
 * <li>Piscosour does not replace other tools, coexists with all of them and allows the best symbiosis of them all.</li>
 * <li>Piscosour shots are easy and reusable components based on a npm dependency.</li>
 * <li>Piscosour execution creates an easily junit.xml filed to manage with the most popular orchestrators like Jenkins, Hudson, Bamboo, etc.</li>
 * </ol>
 *
 * We have moved the idea of a component to use it as a tool to build, to test, to use in a continuous integration tool, etc. For all these tasks we have created Piscosour.
 *
 * To get an idea, it’s a command line jenkins, bamboo, travis or gocd , which allows better reuse of workflows.
 * @constructor Piscosour
 */
var Piscosour = {
    Shot: Shot,
    Sour: Sour,
    fsUtils: fsUtils,
    logger: logger,
    config: config,
    params: params,
    gush: function () {
        notifier.notify();
        this.Sour().gush().then(this.onFulfilled, this.onReject);
    },
    onFulfilled : function(){
        process.exit(0);
    },
    onReject : function(e){
        if (e && e.stack) console.error("\nUncatched error:\n\n",e.stack);
        process.exit(-1);
    }
};

module.exports = Piscosour;