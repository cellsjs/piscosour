'use strict';

const EventEmitter = require('events');

const bus = Object.create(new EventEmitter());

bus.on('uncaughtException', err => {
  console.error(err);
});

module.exports = bus;