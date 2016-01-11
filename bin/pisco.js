#!/usr/bin/env node

var params = require("../lib/params"),
    sour = require("../index").Sour(params);

var onFulfilled = function () {
    process.exit(0);
}

var onRejected = function (err) {
    process.exit(-1);
}

sour.gush().then(onFulfilled, onRejected);