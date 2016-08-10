'use strict';

const nopt = require('nopt');
let knownOpts = {
  'junitReport': Boolean,
  'help': Boolean,
  'all': Boolean,
  'version': Boolean,
  'list': ['all', 'recipes', 'flows', 'steps', 'contexts'],
  'output': ['verbose', 'debug', 'silly'],
  'initStep': [String, null],
  'endStep': [String, null],
  'paramsFile': [String, Array],
  'writeCache': Boolean,
  'showContext': Boolean
};
const shortHands = {
  'u': [ '--junitReport' ],
  'p': [ '--paramsFile' ],
  'w': [ '--writeCache' ],
  'c': [ '--showContext' ],
  'i': [ '--initStep' ],
  'e': [ '--endStep' ],
  'h': [ '--help' ],
  'a': [ '--all' ],
  'la': ['--list', 'all'],
  'lr': ['--list', 'recipes'],
  'lst': ['--list', 'flows'],
  'lsh': ['--list', 'steps'],
  'lt': ['--list', 'contexts'],
  'ov': ['--output', 'verbose'],
  'od': ['--output', 'debug'],
  'os': ['--output', 'silly'],
  'v': [ '--version' ]
};

const defaultString = function(opts) {
  process.argv.forEach((option) => {
    if (option.startsWith('--')) {
      const inopt = option.replace('--', '');
      if (inopt.startsWith('b-')) {
        opts[inopt] = Boolean;
      } else if (!opts[inopt]) {
        opts[inopt] = [String, null];
      }
    }
  });
  return opts;
};

knownOpts = defaultString(knownOpts);
const paramsOpt = nopt(knownOpts, shortHands, process.argv, 2);

const getParams = function() {

  const init = function() {
    const result = {};
    for (const name in paramsOpt) {
      if (name !== 'argv') {
        let param = name;
        if (name.startsWith('b-')) {
          param = name.replace('b-', '');
        }
        result[param] = paramsOpt[name];
      }
    }
    return result;
  };

  const params = init();
  const origParams = JSON.parse(JSON.stringify(params));

  if (origParams.paramsFile) {
    const fsUtils = require('./utils/fsUtils');
    origParams.paramsFile.forEach((paramsFile) => {
      if (fsUtils.exists(paramsFile)) {
        const lastParams = fsUtils.readConfig(paramsFile);
        Object.getOwnPropertyNames(lastParams).forEach((lastName) => {
          origParams[lastName] = lastParams[lastName];
        });
      } else {
        console.warn(`WARNING: paramsFile is defined but ${paramsFile} file doesn't exists!`);
      }
    });
  }

  const merge = function(orig) {
    Object.getOwnPropertyNames(origParams).forEach((name) => {
      orig[name] = origParams[name];
    });
    return orig;
  };

  const info = function(opt) {
    const ev = knownOpts[opt];
    let res = '';
    if (Object.prototype.toString.call(ev) === '[object Array]' && typeof ev[0] === 'string') {
      res = '( ' + ev + ' )';
    }

    res += ' [';
    for (const short in shortHands) {
      if (shortHands[short][0] === '--' + opt) {
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
