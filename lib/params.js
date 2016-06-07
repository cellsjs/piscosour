'use strict';

const nopt = require('nopt');
let knownOpts = {
  'junitReport': Boolean,
  'help': Boolean,
  'all': Boolean,
  'version': Boolean,
  'list': ['all', 'recipes', 'straws', 'shots', 'repoTypes'],
  'output': ['verbose', 'debug', 'silly'],
  'initShot': [String, null],
  'endShot': [String, null],
  'paramsFile': [String, null]
};
const shortHands = {
  'u': [ '--junitReport' ],
  'p': [ '--paramsFile' ],
  'i': [ '--initShot' ],
  'e': [ '--endShot' ],
  'h': [ '--help' ],
  'a': [ '--all' ],
  'la': ['--list', 'all'],
  'lr': ['--list', 'recipes'],
  'lst': ['--list', 'straws'],
  'lsh': ['--list', 'shots'],
  'lt': ['--list', 'repoTypes'],
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
      } else {
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
  const merge = function(orig) {
    if (origParams.paramsFile) {
      const fsUtils = require('./utils/fsUtils');
      if (fsUtils.exists(origParams.paramsFile)) {
        const lastParams = fsUtils.readConfig(origParams.paramsFile);
        Object.getOwnPropertyNames(lastParams).forEach((lastName) => {
          orig[lastName] = lastParams[lastName];
        });
      } else {
        console.warn(`WARNING: paramsFile is defined but ${origParams.paramsFile} file doesn't exists!`);
      }
    }
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