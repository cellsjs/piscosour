'use strict';

const _ = require('lodash');

module.exports = {
  refactorObjectsFromCommandLine(outputParams, key, value){
    var output = _.merge({}, outputParams);
    var object = {};
    var result = object = {};
    key.split('.').forEach(((element,idx, array) => {
      if (idx !== array.length -1) {
        object = object[element] = {};
      } else {
        object[array[array.length - 1]] = value;
      }
    }));
    return _.merge(output, result);
  }
}



