#!/usr/bin/env node
var command = require("./lib/slife-command");

var onFulfilled = function () {
    console.log(" onFulfilled------------------------------------------------------")
    process.exit(0);
}

var onRejected = function (err) {
    console.log(" onRejected------------------------------------------------------")
    process.exit(-1);
}

command.handle().then(onFulfilled, onRejected);