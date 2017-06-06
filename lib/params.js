'use strict';

const nopt = require('nopt');
const _ = require('lodash');
const paramUtils = require('./utils/paramUtils');
const fsUtils = require('./utils/fsUtils');

let knownOpts = {
  'junitReport': Boolean,
  'help': Boolean,
  'functionalTests': Boolean,
  'all': Boolean,
  'version': Boolean,
  'list': [ 'all', 'recipes', 'flows', 'steps', 'contexts' ],
  'output': [ 'verbose', 'debug', 'silly' ],
  'initStep': [ String, null ],
  'endStep': [ String, null ],
  'paramsFile': [ String, Array ],
  'writeCache': Boolean,
  'saveRequirements': Boolean,
  'showContext': Boolean
};
const shortHands = {
  'u': [ '--junitReport' ],
  'p': [ '--paramsFile' ],
  'w': [ '--writeCache' ],
  'sr': [ '--saveRequirements' ],
  'c': [ '--showContext' ],
  'i': [ '--initStep' ],
  'e': [ '--endStep' ],
  'h': [ '--help' ],
  'ft': [ '--functionalTests' ],
  'a': [ '--all' ],
  'la': [ '--list', 'all' ],
  'lr': [ '--list', 'recipes' ],
  'lst': [ '--list', 'flows' ],
  'lsh': [ '--list', 'steps' ],
  'lt': [ '--list', 'contexts' ],
  'ov': [ '--output', 'verbose' ],
  'od': [ '--output', 'debug' ],
  'os': [ '--output', 'silly' ],
  'v': [ '--version' ]
};

const defaultString = function(opts) {
  process.argv.forEach((option) => {
    if (option.startsWith('--')) {
      const inopt = option.replace('--', '');
      if (inopt.startsWith('b-')) {
        opts[ inopt ] = Boolean;
      } else if (!opts[ inopt ]) {
        opts[ inopt ] = [ String, null ];
      }
    }
  });
  return opts;
};

knownOpts = defaultString(knownOpts);
const paramsOpt = nopt(knownOpts, shortHands, process.argv, 2);

const getParams = function() {

  const init = function() {
    let result = {};
    for (const name in paramsOpt) {
      if (name !== 'argv') {
        let param = name;
        if (name.startsWith('b-')) {
          param = name.replace('b-', '');
        }
        if (name.includes('.')) {
          result = paramUtils.refactorObjectsFromCommandLine(result, name, paramsOpt[ name ]);
        }
        result[ param ] = paramsOpt[ name ];
      }
    }
    return result;
  };

  const params = init();
  let origParams = _.cloneDeep(params);

  const merge = function(orig) {
    orig = paramUtils.mergeObjects(origParams, orig, paramUtils.mergeLodash);
    return orig;
  };

  if (origParams.paramsFile) {
    origParams.paramsFile.forEach((paramsFile) => {
      if (fsUtils.exists(paramsFile)) {
        origParams = paramUtils.mergeObjects(origParams, fsUtils.readConfig(paramsFile), paramUtils.mergeLodash);
      } else {
        console.warn(`WARNING: paramsFile is defined but file ${paramsFile} doesn't exist!`);
      }
    });
  }

  const info = function(opt) {
    const ev = knownOpts[ opt ];
    let res = '';
    if (Object.prototype.toString.call(ev) === '[object Array]' && typeof ev[ 0 ] === 'string') {
      res = '( ' + ev + ' )';
    }

    res += ' [';
    for (const short in shortHands) {
      if (shortHands[ short ][ 0 ] === '--' + opt) {
        res += ' -' + short;
      }
    }
    res += ']';
    return res;
  };

  params.knownOpts = knownOpts;
  params.merge = merge;
  params.info = info;
  params.commands = paramsOpt.argv.remain;

  return params;
};

module.exports = getParams();
