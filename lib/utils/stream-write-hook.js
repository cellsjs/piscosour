'use strict';

let _hooks = {};

const hook = function hook(stream, hook) { //eslint-disable-line no-shadow
  let _write = _hooks[stream] = stream.write;
  let _hook = hook;

  stream.write = function(chunk, encoding, cb) {
    _write.apply(stream, arguments);
    _hook(chunk, encoding, cb);
  };
};

const unhook = function unhook(stream) {
  stream.write = _hooks[stream];
};

module.exports = {
  hook: hook,
  unhook: unhook
};