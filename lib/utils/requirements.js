'use strict';

const semver = require('semver');
const os = require('os');
const path = require('path');
const fs = require('fs');
const logger = require('../logger');
const launcher = require('./launcher');

const _getVersion = (cmd, result, options, father) => {
  let regexp;
  if (options.listedIn) {
    regexp = `${options.key ? options.key : cmd}${options.regexp !== undefined ? options.regexp : father.regexp}`;
  } else {
    regexp = options.regexp;
  }
  let version = result.output ? result.output : result.stderr;
  if (regexp) {
    const match = version.match(regexp);
    if (match && match.length > 1) {
      version = match[1].replace(os.EOL, '');
    } else {
      version = options.listedIn ? 'not listed' : version.substring(0, version.length > 20 ? 20 : version.length);
    }
  }
  version = version ? version.replace(os.EOL, '') : 'none';
  return version;
};
const _cachedExec = (command, noCache) => {
  if (!global.pisco_executions) {
    global.pisco_executions = {};
  }
  let result = noCache ? false : global.pisco_executions[command];
  if (!result) {
    const cmds = command.split(' ');
    global.pisco_executions[command] = launcher.execute(cmds[0], cmds.slice(1), {mute: true, stdio: ['ignore', 'pipe', 'pipe']})
      .then((result) => {
        global.pisco_executions[command] = result;
        return result;
      });
    return global.pisco_executions[command];
  } else if (!result.then) {
    result = Promise.resolve(result);
  }
  return result;
};
const _sh = (cmd, options, father, noCache) => {
  if (options.listedIn) {
    if (father && father.list) {
      logger.trace('Getting list for', cmd);
      return _cachedExec(father.list, noCache);
    } else {
      return Promise.reject({error: `There is no definition for listing in ${options.listedIn}`});
    }
  } else {
    let option = options.option ? options.option : '-v';
    if (options.uncheckable) {
      return {
        output: 'uncheckable'
      };
    } else {
      return _cachedExec(`${cmd} ${option}`, noCache);
    }
  }
};
const _check = (cmd, options, result, father) => new Promise((ok, ko) => {
  let out = {version: options.version ? options.version : 'any', uncheckable : options.uncheckable};
  if (result.status < 0) {
    out.error = `'${cmd}' is not found!!`;
    out.data = result.output;
  } else if (result.status >= 0) {
    const actual = _getVersion(cmd, result, options, father);
    if (options.version) {
      if (semver.valid(actual) && semver.satisfies(actual, options.version)) {
        out.message = ['#green', cmd, '(', actual, ') is installed ...', '#green', 'OK'];
      } else {
        out.error = `not satisfied by: '${actual}'`;
      }
    } else {
      out.message = ['#green', cmd, '(', actual, ') is installed ...', '#green', 'OK'];
    }
  }
  if (out.error && !options.uncheckable) {
    ko(out);
  } else {
    ok(out);
  }
  logger.info.apply(logger, ['#cyan', cmd, '(', out.version, ') is required -> '].concat(out.message ? out.message : [out.error, '...', options.uncheckable ? '#green' : '#red', options.uncheckable ? 'OK (uncheckable)' : 'ERROR!']));
});

module.exports = {
  sh: _sh,
  check: _check
};