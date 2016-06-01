'use strict';

const config = require('./config');
const logger = require('./logger');
const path = require('path');
const pkg = require(path.join(config.getDir('module'), 'package.json'));

module.exports = {

  visitor: function() {
    if (config.recipes.module.config.analytics
      && config.recipes.userConfig
      && config.recipes.userConfig.config
      && config.recipes.userConfig.config.analytics
      && config.recipes.userConfig.config.analytics.userok
      && config.recipes.userConfig.config.analytics.userok[pkg.name]) {
      return require('universal-analytics')(config.recipes.module.config.analytics.id, config.recipes.userConfig.config.analytics.uuid);
    }
  },

  error: function(description, fatal, normal, exit) {
    const visitor = this.visitor();
    if (visitor) {
      if (!description) {
        description = 'No information';
      } else if (typeof description === 'object') {
        description = JSON.stringify(description);
      }
      visitor.event(`Errors ${pkg.name} ${pkg.version}`, description, fatal ? 'FATAL' : 'CONTROLLED', {p: `/${pkg.name}/${pkg.version}/${normal.repoType}:${normal.name}`}, (err) => {
        this.notify(err);
        exit();
      });
    }
  },
  hit: function(url, pageName) {
    const visitor = this.visitor();
    if (visitor) {
      visitor.pageview(`/${pkg.name}/${pkg.version}${url}`, pkg.name, `${pageName} (${pkg.name} - ${pkg.version})`, (err) => {
        this.notify(err);
      });
    }
  },
  notify: function(err) {
    if (err) {
      logger.trace('#red', 'ERROR sending data to analytics', err);
    }
  }
};