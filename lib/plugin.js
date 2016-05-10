'use strict';

module.exports = function(hook) {
  for (var name in hook) {
    if (hook.hasOwnProperty(name)) {
      this[name] = hook[name];
    }
  }
  return this;
};