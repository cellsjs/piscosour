'use strict';

const hook = function hook(stream, _hook) {
  stream._old_write = stream.write;

  stream.write = function(chunk, encoding, cb) {
    stream._old_write.apply(stream, arguments);
    _hook(chunk, encoding, cb);
  };
};

const unhook = function unhook(stream) {
  stream.write = stream._old_write;
  delete stream._old_write;
};

module.exports = {
  hook: hook,
  unhook: unhook
};