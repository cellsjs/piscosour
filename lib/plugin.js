/*jshint node:true */

'use strict';

var Plugin = function(hook){
    for (var name in hook) {
        this[name] = hook[name];
    }
    return this;
};

module.exports = Plugin;