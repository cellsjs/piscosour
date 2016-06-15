'use strict';

const logger = require('./logger');
const shooter = require('./shooter');
const moment = require('moment');
const config = require('./config');
const analytics = require('./analytics');

const sipper = function() {

  let shots = [];
  let straw = {};

  const synchro = function(normal, n, resolve, reject) {

    const _resolve = function(outputs) {
      if (outputs) {
        logger.trace('#cyan', 'outputs of', shots[n], '->', outputs);
        straw.shots[shots[n]].outputs = outputs;
      }
      synchro(normal, n + 1, resolve, reject);
    };

    const _reject = function(err) {
      if (err && err.keep) {
        logger.warn('#green', 'sipper', '#yellow', 'Shot error don\'t stops the straw!!', (err.error || err));
        synchro(normal, n + 1, resolve, reject);
      } else {
        logger.error('#green', 'sipper', 'Shot error stops the straw!!', '#red', 'ERROR:', (err.error || err));
        reject(err);
      }
    };

    const _addOutputs = function(params, inputs) {
      if (inputs) {
        Object.getOwnPropertyNames(inputs).forEach((input) => {
          const pair = inputs[input];
          Object.getOwnPropertyNames(pair).forEach((shotName) => {
            const outputs = straw.shots[shotName].outputs;
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

      const shot = straw.shots[shots[n]];

      const normalShot = JSON.parse(JSON.stringify(normal));
      normalShot.name = shots[n];
      normalShot.orig = normal.context + ':' + normalShot.name;

      if (shot.type === 'straw') {
        normalShot.order = n + 1;
        sipper().execute(normalShot, shot.from, shot.to, _resolve, _reject);
      } else {
        normalShot.params = config.getStrawParams(normalShot, normal);
        normalShot.params = _addOutputs(normalShot.params, shot.inputs);
        normalShot.order = n + (normal.order ? normal.order : 1);
        analytics.hit(`/straws/${normal.context}:${normal.name}/shots/${normalShot.name}`, `shot: ${normal.context}::${normalShot.name}`);
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
  const filterShots = function(strawName, fromShot, toShot) {
    logger.trace('#green', 'sipper:filterShots', 'straw:', strawName, 'fromShot:', fromShot, 'toShot:', toShot);

    let rshots = Object.keys(straw.shots);
    logger.trace('#green', 'sipper:filterShots', 'shots before:', rshots);

    let fromIndex = rshots.indexOf(fromShot);
    let toIndex = rshots.lastIndexOf(toShot);

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
  const execute = function(normal, fromShot, toShot, resolve, reject) {
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