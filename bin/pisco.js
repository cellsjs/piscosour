#!/usr/bin/env node

var sour = require("../index").Sour();

var onFulfilled = function () {
    process.exit(0);
}

var onRejected = function (err) {
    process.exit(-1);
}

sour.gush().then(onFulfilled, onRejected);