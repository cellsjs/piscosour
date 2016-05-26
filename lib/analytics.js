'use strict';

const ua = require('universal-analytics');
const config = require('./config');
const logger = require('./logger');
const path = require('path');
const pkg = require(path.join(config.getDir('module'), 'package.json'));

module.exports = {

  visitor: function() {
    logger.trace('#green', 'analytics', 'id', config.analytics.id);
    let visitor;
    if (config.recipes.module.config.analytics) {
      visitor = ua(config.recipes.module.config.analytics.id);
    }
    return visitor;
  },

  error: function(description, fatal, exit) {
    const visitor = this.visitor();
    if (visitor) {
      if (!description) {
        description = 'No information';
      } else if (typeof description === 'object') {
        description = JSON.stringify(description);
      }
      visitor.event('Errors', `${pkg.name} - ${pkg.version} - ${description}`, fatal ? 'FATAL' : 'CONTROLLED', (err) => {
        this.cb(err);
        exit();
      });
    }
  },
  hit: function(url, pageName, normal) {
    const visitor = this.visitor();
    if (visitor) {
      visitor.pageview(`/${pkg.version}${url}`, pkg.name, `${pageName} (${pkg.name} - ${pkg.version})`, (err) => {
        this.cb(err);
      });
    }
  },
  cb: function(err) {
    if (err) {
      logger.trace('#red', 'ERROR sending data to analytics', err);
    }
  }
};