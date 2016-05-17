'use strict';

let nopt = require('nopt');
let knownOpts = {
  'junitReport': Boolean,
  'help': Boolean,
  'all': Boolean,
  'version': Boolean,
  'list': ['all', 'recipes', 'straws', 'shots', 'repoTypes'],
  'output': ['verbose', 'debug', 'silly'],
  'initShot': [String, null],
  'endShot': [String, null]
};
let shortHands = {
  'u': [ '--junitReport' ],
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

let defaultString = function(opts) {
  process.argv.forEach((option) => {
    if (option.startsWith('--')) {
      let inopt = option.replace('--', '');
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
var paramsOpt = nopt(knownOpts, shortHands, process.argv, 2);

const getParams = function() {

  let init = function() {
    let result = {};
    for (var name in paramsOpt) {
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

  let params = init();
  let origParams = JSON.parse(JSON.stringify(params));

  const merge = function(orig) {
    Object.getOwnPropertyNames(origParams).forEach((name) => {
      orig[name] = origParams[name];
    });

    return orig;
  };

  const info = function(opt) {
    let ev = knownOpts[opt];
    let res = '';
    if (Object.prototype.toString.call(ev) === '[object Array]' && typeof ev[0] === 'string') {
      res = '( ' + ev + ' )';
    }

    res += ' [';
    for (var short in shortHands) {
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