'use strict';

const EventEmitter = require('events');

const _bus = Symbol('_bus');
const bus = {

  [_bus]: Object.create(new EventEmitter()),

  emit() {
    this[_bus].emit.apply(this[_bus], arguments);
    return this;
  },

  on() {
    this[_bus].on.apply(this[_bus], arguments);
    return this;
  }

};

module.exports = bus;