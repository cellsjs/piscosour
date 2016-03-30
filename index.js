/*jshint node:true */

'use strict';

var moment = require('moment'),
    init = moment(),
    logger = require("./lib/logger"),
    config = require("./lib/config"),
    Sour = require("./lib/sour");

const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const notifier = updateNotifier({pkg, updateCheckInterval: 1000 * 60 * 60 * 12});

/**
 * Piscosour
 * ---------
 *
 * - Piscosour gets all command line (CLI) development tools wrapped-up, creating command line workflows.
 * - Piscosour does not replace other tools, coexists with all of them and allows the best symbiosis of them all.
 * - Piscosour shots are easy and reusable components based on a npm dependency.
 * - Piscosour execution creates an easily junit.xml filed to manage with the most popular orchestrators like Jenkins, Hudson, Bamboo, etc.
 *
 * We have moved the idea of a component to use it as a tool to build, to test, to use in a continuous integration tool, etc. For all these tasks we have created Piscosour.
 *
 * To get an idea, it’s a command line jenkins, bamboo, travis or gocd , which allows better reuse of workflows.
 * @constructor Piscosour
 */
var Piscosour = {
    config: config,
    Sour: Sour,
    gush: function () {
        notifier.notify();
        logger.info("Loading time","-","#duration",moment()-init);
        this.Sour().gush(init).then(this.onFulfilled, this.onReject);
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