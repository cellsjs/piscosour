'use strict';

let fs = require('fs');
let path = require('path');
let docs = require('../../../lib/docs');

module.exports = {

  pkg: {},

  run: function() {
    this.runner.pkg = this.fsReadConfig(this.pkgFile);
    this.logger.info('#magenta', 'run', 'Merge all info.md of straws and shots in the readme.md');

    var bundle = [];

    bundle = this.runner._addBundle(this.runner._getStarted(), null, bundle);
    bundle = this.runner._addBundle('# Recipes', null, bundle);
    bundle = this.runner._addBundle(this.runner._infoRecipe(), null, bundle);
    bundle = this.runner._addBundle('# Commands', null, bundle);
    bundle = this.runner._addBundle(this.runner._commandsIndex(), null, bundle);
    this.runner._infoStraws(bundle);
    bundle = this.runner._addBundle('\n# Plugins', null, bundle);
    this.runner._infoPlugins(bundle);

    this.fsAppendBundle(bundle, 'README.md', ' Installing ' + this.runner.pkg.name);
  },

  _getStarted: function() {
    var content = `Install ${this.runner.pkg.name} globally\n\n`;
    content += `    npm install -g ${this.runner.pkg.name}`;
    return content;
  },

  _commandsIndex: function() {

    var content = '';
    var enriched = docs.enrichCommands(null, true);

    Object.getOwnPropertyNames(enriched).forEach((recipeKey) => {
      var recipe = enriched[recipeKey].___recipe;
      if (recipe) {
        if (recipeKey !== 'piscosour') {
          content += `\n**from ${recipe.name}  v.${recipe.version}:**\n\n`;
          Object.getOwnPropertyNames(enriched[recipeKey]).forEach((command) => {
            if (command !== '___recipe') {
              var enrich = enriched[recipeKey][command];
              var piscoCfg = this.fsReadConfig(this.piscoFile);
              content += `- **${piscoCfg.cmd} ${command}** ( ${enrich.description} )\n`;
            }
          });
        }
      }
    });
    return content;

  },

  _infoRecipe: function() {
    var content = '|Name|Version|Description|\n';
    content += '|---|---|---|\n';
    Object.getOwnPropertyNames(this.config.recipes).forEach((recipeName) => {
      var recipe = this.config.recipes[recipeName];
      if (recipe.name) {
        content += '|' + recipe.name + '|' + recipe.version + '|' + recipe.description + '|\n';
      }
    });
    return content;
  },

  _infoPlugins: function(bundle) {
    Object.getOwnPropertyNames(this.config.recipes).forEach((recipeName) => {
      var recipe = this.config.recipes[recipeName];
      var dirPlugins = path.join(recipe.dir, 'plugins');
      if (recipe.name && this.fsExists(dirPlugins) && recipeName !== 'piscosour') {
        this.logger.info('#green', 'reading', dirPlugins);
        var plugins = fs.readdirSync(dirPlugins);

        plugins.forEach((dir) => {
          this.logger.info('processing plugin', '#cyan', dir, '...');
          var fileMd = path.join(recipe.dir, 'plugins', dir, 'info.md');
          var file = path.join(recipe.dir, 'plugins', dir, 'plugin.js');
          bundle = this.runner._addBundle('## ' + dir, fileMd, bundle, true);
        });
      }
    });
  },

  _infoStraws: function(bundle) {
    Object.getOwnPropertyNames(this.config.recipes).forEach((recipeName) => {
      var recipe = this.config.recipes[recipeName];
      var dirStraw = path.join(recipe.dir, 'straws');
      if (recipe.name && this.fsExists(dirStraw) && recipeName !== 'piscosour') {
        this.logger.info('#green', 'reading', dirStraw);
        var straws = fs.readdirSync(dirStraw);
        straws.forEach((dir) => {
          this.logger.info('processing straw', '#cyan', dir, '...');
          var straw = this.fsReadConfig(path.join(recipe.dir, 'straws', dir, 'straw.json'));
          if (straw.type === 'normal') {
            this.runner._infoStraw(bundle, straw, dir);
          }
        });
      }
    });
  },

  _infoStraw: function(bundle, straw, dir, p) {
    var file = path.join(process.cwd(), 'straws', dir, 'info.md');
    bundle = this.runner._addBundle('## ' + dir + ': \'' + straw.name + '\'', file, bundle, true, straw.description);

    var n = 1;
    Object.getOwnPropertyNames(straw.shots).forEach((shotName) => {
      var shot = straw.shots[shotName];
      this.logger.info('#green', 'reading', 'shot', '#cyan', shotName);
      shotName = shotName.indexOf(':') >= 0 ? shotName.split(':')[0] : shotName;
      if (shot.type === 'straw') {
        var strawShot = this.fsReadConfig(path.join(process.cwd(), 'straws', shotName, 'straw.json'));
        this.runner._infoStraw(bundle, strawShot, '# ' + n + '. (Straw) ' + shotName, n);
        n++;
      } else {
        Object.getOwnPropertyNames(this.config.recipes).forEach((recipeName) => {
          var recipe = this.config.recipes[recipeName];
          if (recipe.name && recipe.shots && recipe.shots[shotName]) {
            file = path.join(recipe.dir, 'shots', shotName, 'info.md');
            var info = this.config.getShotInfo(shotName);
            bundle = this.runner._addBundle('\n### ' + n + (p ? '.' + p : '') + '. ' + shotName + ': \'' + info.description + '\'', file, bundle, true, this.runner._infomd(info));
            n++;

            this.config.repoTypes.forEach((type) => {
              file = path.join(recipe.dir, 'shots', shotName, type, 'info.md');
              bundle = this.runner._addBundle('\n#### For type ' + type + ':', file, bundle);
            });
          }
        });
      }
    });
  },

  _infomd: function(info) {
    var r = '```\n';
    r += 'Repository types:';
    info.types.forEach((type, i, a) => {
      r += '  ' + type;
      if (i < a.length - 1) {
        r += ',';
      }
    });
    r += '\nRecipes:';
    info.recipes.forEach((recipe, i, a) => {
      r += ' ' + recipe.name + ' (' + recipe.version + ')';
      if (i < a.length - 1) {
        r += '\n              ';
      }
    });
    r += '\n```';
    return r;
  },

  _addBundle: function(title, file, bundle, force, subtitle) {
    if (!file || this.fsExists(file) || force) {
      bundle.push({
        title: title,
        subtitle: subtitle,
        file: file
      });
    }
    return bundle;
  }
};