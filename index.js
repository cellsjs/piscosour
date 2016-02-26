/*jshint node:true */

'use strict';

var Shot = require("./lib/shot"),
    logger = require("./lib/logger"),
    config = require("./lib/config"),
    params = require("./lib/params"),
    fsUtils = require("./lib/utils/fsUtils"),
    Sour = require("./lib/sour");

/**
 * Object containing all module functionality
 */
var Piscosour = {
    Shot: Shot,
    Sour: Sour,
    fsUtils: fsUtils,
    logger: logger,
    config: config,
    params: params,
    gush: function () {
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