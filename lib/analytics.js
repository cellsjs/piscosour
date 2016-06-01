'use strict';

const config = require('./config');
const logger = require('./logger');
const params = require('./params');
const path = require('path');
const pkg = require(path.join(config.getDir('module'), 'package.json'));

module.exports = {

  _visitor: undefined,

  visitor: function() {
    if (config.recipes.module.config.analytics
      && config.recipes.userConfig
      && config.recipes.userConfig.config
      && config.recipes.userConfig.config.analytics
      && config.recipes.userConfig.config.analytics.userok
      && config.recipes.userConfig.config.analytics.userok[pkg.name]) {
      if (!this._visitor) {
        let uuid = config.recipes.userConfig.config.analytics.uuid;
        if (params.uuid) {
          uuid = params.uuid;
        }
        this._visitor = require('universal-analytics')(config.recipes.module.config.analytics.id, uuid);
      }
      return this._visitor;
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
      logger.info('#red', 'ERROR sending data to analytics', err);
    }
  }
};