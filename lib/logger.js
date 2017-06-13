'use strict';

const moment = require('moment');
const params = require('./params');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const levels = {
  silly: 5,
  debug: 4,
  verbose: 3,
  info: 2,
  warning: 1,
  error: 0,
  default: 2
};
let gLevel;

const countIt = function(args){
  let n = 0;
  args.forEach((arg) => {
    n += arg.startsWith('#') ? 2: arg.length;
  });
  return n;
};

const repeatIt = function(char, n) {
  let res = char;
  for (let i = 0; i < n-1; i++) {
    res += char;
  }
  return res;
};

/**
 * Generate logger wrapper to be use inside a Step.
 *
 * There are 6 levels:
 *
 * 5. silly,
 * 4. debug,
 * 3. verbose,
 * 2. info,
 * 1. warning,
 * 0. error
 *
 * Formating messages is possible with chalk tags...
 *
 * Example of use inside step
 *
 * ```
 * this.logger.info('#green','text');
 * ```
 *
 * @module logger
 */
const logger = {

  getLevel() {
    if (gLevel === undefined){
      gLevel = levels[params.output];
      if (!gLevel) {
        gLevel = levels.default;
      }
    }
    return gLevel;
  },

  setLevel(level) {
    gLevel = level;
  },

  isLevel: function(name) {
    return logger.getLevel() >= levels[name];
  },

  //TODO: concatenar estilos de chalk red + bold (etc..)
  prettyPrint: function() {
    const args = Array.prototype.slice.call(arguments);
    const initArg = args[0];
    const res = [ '[' + chalk.grey(moment().format('HH:mm:ss')) + ']' ];
    let color;
    for (const con in initArg) {
      if (initArg.hasOwnProperty(con)) {
        let item = initArg[con];
        if (item && typeof item === 'string' && item.charAt(0) === '#') {
          color = item.replace('#', '');
        } else {
          if (color) {
            if (color === 'duration') {
              item = chalk.cyan(moment.utc(item).format(logger.duration(item)));
            } else if (chalk[color]) {
              item = chalk[color](item);
            }
            color = null;
          }
          res.push(item);
        }
      }
    }
    return res;
  },
  duration: function(milis) {
    let pattern = 'SSS [ms]';
    if (milis >= 1000 && milis < 60000) {
      pattern = 'ss [s] SSS [ms]';
    } else if (milis >= 60000 && milis < 3600000) {
      pattern = 'mm [m] ss [s] SSS [ms]';
    } else if (milis >= 3600000) {
      pattern = 'hh [h] mm [m] ss [s] SSS [ms]';
    }
    return pattern;
  },
  out: function() {
    process.stdout.write.apply(process.stdout, arguments);
  },
  err: function() {
    process.stderr.write.apply(process.stderr, arguments);
  },
  txt: function() {
    console.log.apply(this, arguments);
  },
  traceError: function() {
    console.trace.apply(this, this.prettyPrint(arguments));
  },
  error: function() {
    console.error.apply(this, this.prettyPrint(arguments));
  },
  warn: function() {
    if (logger.getLevel() >= 1) {
      console.info.apply(this, this.prettyPrint(arguments));
    }
  },
  framed: function() {
    if (logger.getLevel() >= 2) {
      const args = Array.prototype.slice.call(arguments);
      const count = countIt(args);
      let res = ['\n\n', '#cyan', repeatIt('*', (count/2) - 1), '#green', 'READ THIS', '#cyan', repeatIt('*', (count/2) - 1), '\n\n', '   '];
      res = res.concat(args);
      res.push('\n\n', '#cyan', repeatIt('*', count+10 < 13 ? 13 : count+10),'\n');
      console.info.apply(this, this.prettyPrint(res));
    }
  },
  info: function() {
    if (logger.getLevel() >= 2) {
      console.info.apply(this, this.prettyPrint(arguments));
    }
  },
  trace: function() {
    if (logger.getLevel() >= 3) {
      console.info.apply(this, this.prettyPrint(arguments));
    }
  },
  debug: function() {
    if (logger.getLevel() >= 4) {
      console.info.apply(this, this.prettyPrint(arguments));
    }
  },
  silly: function() {
    if (logger.getLevel() >= 5) {
      console.info.apply(this, this.prettyPrint(arguments));
    }
  },
  parseMd: function() {
    var marked = require('marked');
    var TerminalRenderer = require('marked-terminal');

    marked.setOptions({
      renderer: new TerminalRenderer()
    });
    const args = Array.prototype.slice.call(arguments);
    let txt = '';
    args.forEach((file) => {
      let buffer;
      try {
        buffer = fs.readFileSync(file);
        txt = buffer.toString();
        return;
      } catch (e) {
        this.trace('Error reading', file, e);
      }
    });
    this.txt(marked(txt));
  }
};

module.exports = logger;
