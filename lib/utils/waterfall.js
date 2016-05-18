'use strict';

const Waterfall = function(config) {
  this.logger = config.logger;
  this.config = config;
  this.n = 0;
  this.last = this.config.promises.length;
};


Waterfall.prototype.start = function() {
  this.logger.silly('Start promises');
  return new Promise((resolve, reject) => {
    this._run(resolve, reject);
  });
};

Waterfall.prototype._run = function(resolve, reject) {

  const _resolve = (result) => {
    this.logger.silly('_resolve', result);
    const isLast = this.n === this.last - 1;
    if (result && result.skip || isLast) {
      resolve(result);
    } else {
      this.n++;
      this._run(resolve, reject);
    }
  };

  const _reject = (err) => {
    this.logger.silly('_reject', err);
    reject(err);
  };

  if (this.n < this.last) {
    this.logger.silly('Executing promise', this.n, 'of', this.last);

    const promise = this.config.promises[this.n].fn.apply(this.config.promises[this.n].obj, this.config.promises[this.n].args);

    if (promise) {
      promise.then(_resolve, _reject);
    } else {
      this.logger.silly('Promise: (', this.n, ') is not defined!');
      _resolve({skipped: true});
    }

  } else {
    resolve();
  }
};

module.exports = Waterfall;