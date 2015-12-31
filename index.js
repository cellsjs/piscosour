#!/usr/bin/env node
var command = require("./lib/slife-command");

var onFulfilled = function () {
    process.exit(0);
}

var onRejected = function (err) {
    process.exit(-1);
}

command.handle().then(onFulfilled, onRejected);