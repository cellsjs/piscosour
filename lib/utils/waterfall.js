/*jshint node:true */

'use strict';

var Waterfall = function(config){
    this.logger = config.logger;
    this.config = config;
    this.n = 0;
    this.last = this.config.promises.length;
};


Waterfall.prototype.start = function(){
    this.logger.silly("Start promises");
    return new Promise(function (resolve, reject){
        this._run(resolve, reject);
    }.bind(this));
};

Waterfall.prototype._run = function(resolve, reject){

    var _resolve = function(result){
        this.logger.silly("_resolve", result);
        var isLast = this.n === this.last - 1;
        if (result && result.skip || isLast) {
            resolve(result);
        }else{
            this.n++;
            this._run(resolve, reject);
        }
    }.bind(this);

    var _reject = function(err){
        this.logger.silly("_reject", err);
        var isLast = this.n===this.last-1;
        if (err && err.keep || isLast ) {
            this.n++;
            this._run(resolve, reject);
        }else {
            reject(err);
        }
    }.bind(this);

    if (this.n<this.last) {
        this.logger.silly("Executing promise", this.n, "of",this.last);

        var promise = this.config.promises[this.n].fn.apply(this.config.promises[this.n].obj,this.config.promises[this.n].args);

        if (promise)
            promise.then(_resolve, _reject);
        else{
            this.logger.silly("Promise: (", this.n, ") is not defined!");
            _resolve({skipped: true});
        }

    }else
        resolve();
};

module.exports = Waterfall;
