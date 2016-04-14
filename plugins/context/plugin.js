'use strict';

var path = require('path'),
    context = require('../../lib/context');

module.exports = {
    description : "Get automatic context of execution",

    addons : {
        ctxIs : context.cis
    }
};