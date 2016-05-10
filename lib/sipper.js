'use strict';

let logger = require('./logger');
let shooter = require('./shooter');
let moment = require('moment');
let config = require('./config');

var sipper = function() {

  var shots = [];
  var straw = {};

  var synchro = function(normal, n, resolve, reject) {

    var _resolve = function(outputs) {
      if (outputs) {
        logger.trace('#cyan', 'outputs of', shots[n], '->', outputs);
        straw.shots[shots[n]].outputs = outputs;
      }
      synchro(normal, n + 1, resolve, reject);
    };

    var _reject = function(err) {
      if (err && err.keep) {
        logger.warn('#green', 'sipper', '#yellow', 'Shot error don\'t stops the straw!!', (err.error || err));
        synchro(normal, n + 1, resolve, reject);
      } else {
        logger.error('#green', 'sipper', 'Shot error stops the straw!!', '#red', 'ERROR:', (err.error || err));
        reject(err);
      }
    };

    var _addOutputs = function(params, inputs) {
      if (inputs) {
        Object.getOwnPropertyNames(inputs).forEach((input) => {
          var pair = inputs[input];
          Object.getOwnPropertyNames(pair).forEach((shotName) => {
            var outputs = straw.shots[shotName].outputs;
            if (outputs) {
              params[input] = outputs[pair[shotName]];
            }
          });
        });
      }
      return params;
    };

    if (n < shots.length) {
      logger.trace('#green', 'sipper', 'trying', '#cyan', shots[n], '(', n, 'of', shots.length, ')');

      var shot = straw.shots[shots[n]];

      var normalShot = JSON.parse(JSON.stringify(normal));
      normalShot.name = shots[n];
      normalShot.orig = normal.repoType + ':' + normalShot.name;

      if (shot.type === 'straw') {
        normalShot.order = n + 1;
        sipper().execute(normalShot, shot.from, shot.to, _resolve, _reject);
      } else {
        normalShot.params = config.getStrawParams(normalShot, normal);
        normalShot.params = _addOutputs(normalShot.params, shot.inputs);
        normalShot.order = n + (normal.order ? normal.order : 1);
        shooter.execute(normalShot, _resolve, _reject);
      }

    } else {
      logger.info('Straw', '[', '#bold', normal.orig, ']', 'sipped -', '#duration', moment() - normal.initStraw);
      resolve();
    }
  };

  /**
   * Filter shots 'from' and 'to' the straw in params
   *
   * @param straw
   * @param fromShot
   * @param toShot
   * @returns {Array}
   */
  var filterShots = function(strawName, fromShot, toShot) {
    logger.trace('#green', 'sipper:filterShots', 'straw:', strawName, 'fromShot:', fromShot, 'toShot:', toShot);

    var rshots = Object.keys(straw.shots);
    logger.trace('#green', 'sipper:filterShots', 'shots before:', rshots);

    var fromIndex = rshots.indexOf(fromShot);
    var toIndex = rshots.lastIndexOf(toShot);

    if (fromIndex < 0) {
      fromIndex = 0;
    }
    if (toIndex < 0) {
      toIndex = rshots.length;
    } else {
      toIndex = toIndex + 1;
    }

    rshots = rshots.slice(fromIndex, toIndex);
    logger.trace('#green', 'sipper:filterShots', 'shots after:', rshots);
    return rshots;
  };

  /**
   * Run all the commands contained on a straw from fromShot to toShot
   *
   * @param straw normalized
   * @param fromShot
   * @param toShot
   */
  var execute = function(normal, fromShot, toShot, resolve, reject) {
    logger.trace('#green', 'sipper:execute', 'straw:', normal.orig, 'fromShot:', fromShot, 'toShot:', toShot);
    straw = config.getStraw(normal);
    normal.initStraw = moment();
    shots = filterShots(normal.name, fromShot, toShot);
    logger.info('Sipping straw', '[', '#bold', normal.orig, ']', 'shots:', shots);
    synchro(normal, 0, resolve, reject);
  };

  return {
    execute: execute
  };

};

/**
 * **Internal:**
 *
 * Execute in waterfall all the shots of a straw.
 *
 * @module sipper
 */
module.exports = sipper();