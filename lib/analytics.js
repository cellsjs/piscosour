'use strict';

const config = require('./config');
const logger = require('./logger');
const params = require('./params');
const path = require('path');
const pkg = require(path.join(config.getDir('module'), 'package.json'));

module.exports = {

  _visitor: undefined,

  visitor: function() {
    const _config = config.get();
    let uuid;
    if (_config.recipes.userConfig
      && _config.recipes.userConfig.config
      && _config.recipes.userConfig.config.analytics
      && _config.recipes.userConfig.config.analytics.userok
      && _config.recipes.userConfig.config.analytics.userok[pkg.name]) {
      uuid = _config.recipes.userConfig.config.analytics.uuid;
    }
    if (params.uuid) {
      uuid = params.uuid;
    }
    if (_config.recipes.module.config.analytics
      && !this._visitor
      && uuid) {
      this._visitor = require('universal-analytics')(_config.recipes.module.config.analytics.id, uuid);
    }
    return this._visitor;
  },

  error: function(description, fatal, normal, exit) {
    const visitor = this.visitor();
    normal = normal ? normal : {};
    if (visitor) {
      if (!description) {
        description = 'No information';
      } else if (typeof description !== 'object') {
      } else {
        try {
          description = JSON.stringify(description);
        } catch (e) {
          description = description.args;
        }
      }
      logger.trace('#magenta', 'sending', '#red', 'ERROR', 'to google analytics');
      visitor.event(`Errors ${pkg.name} ${pkg.version}`, description, fatal ? 'FATAL' : 'CONTROLLED', {p: `/${pkg.name}/${pkg.version}/${normal.context}:${normal.name}`}, (err) => {
        this.notify(err);
        exit();
      });
    } else {
      exit();
    }
  },
  hit: function(url, pageName) {
    const visitor = this.visitor();
    if (visitor) {
      let page = `/${pkg.name}/${pkg.version}${url}`;
      logger.trace('#cyan', `sending ${page} to google analytics`);
      visitor.pageview(page, pkg.name, `${pageName} (${pkg.name} - ${pkg.version})`, (err) => {
        this.notify(err);
      });
    }
  },
  notify: function(err) {
    if (err) {
      logger.trace('#red', 'ERROR sending data to analytics', err);
    } else {
      logger.trace('data sent', '#green',  'OK', 'to analytics');
    }
  }
};