'use strict';

const fs = require('fs');
const path = require('path');
const docs = require('../../../lib/docs');
const enriched = docs.enrichCommands(null, true);

module.exports = {

  pkg: {},

  run: function() {
    this.runner.pkg = this.fsReadConfig(this.pkgFile);

    let bundle = [];

    bundle = this.runner._addBundle(this.runner._menu(), null, bundle);
    bundle = this.runner._addBundle('# All Commands Availables', null, bundle);
    this.runner._infoStraws(bundle);
    bundle = this.runner._addBundle('\n# Plugins', null, bundle);
    this.runner._infoPlugins(bundle);
    bundle = this.runner._addBundle('# Contexts', null, bundle);
    bundle = this.runner._addBundle(this.runner._infoContexts(), null, bundle);
    bundle = this.runner._addBundle('# Recipes', null, bundle);
    bundle = this.runner._addBundle(this.runner._infoRecipe(), null, bundle);

    this.fsAppendBundle(bundle, 'README.md', ' Main Index:');
  },

  _menu() {
    let content = '';
    if (this.config.commands) {
      content += '- User Commands\n';
      content = this.runner._userCommandsIndex(content);
    }
    content += '- [Plugins](#plugins)\n';
    content = this.runner._pluginsIndex(content);
    content += '- [Contexts](#contexts)\n';
    content += '- [Recipes](#recipes)\n';
    content += `- [All Commands Availables](#all-commands-availables)\n`;
    content = this.runner._commandsIndex(content);
    return content;
  },

  _getStarted: function() {
    let content = `Install ${this.runner.pkg.name} globally\n\n`;
    content += `    npm install -g ${this.runner.pkg.name}`;
    content += `\n\nOnce installed, ${this.config.cmd} command will be available for you`;
    return content;
  },

  _formatMdLink(link) {
    link = link.trim();
    link = link.replace(/:/g, '');
    link = link.replace(/\./g, '');
    link = link.replace(/ /g, '-');
    link = link.toLowerCase();
    return link;
  },

  _commandsIndex: function(content) {
    const tab = '    ';

    Object.getOwnPropertyNames(enriched).sort().forEach((recipeKey) => {
      const recipe = enriched[recipeKey].___recipe;
      if (recipe) {
        if (recipeKey !== 'piscosour') {
          content += `${tab}- from **${recipe.name}  v.${recipe.version}**\n`;
          const iterable = Object.getOwnPropertyNames(enriched[recipeKey]).sort();
          ['straw', 'shot'].forEach((type) => {
            iterable.forEach((command) => {
              const enrich = enriched[recipeKey][command];
              if (command !== '___recipe' && enrich.type === type) {
                const piscoCfg = this.fsReadConfig(this.piscoFile);
                content += `${tab}${tab}- [${command} (${enrich.description})](#${this.runner._formatMdLink(`${command} ${enrich.description}`)})\n`;
              }
            });
          });
        }
      }
    });
    return content;
  },

  _userCommandsIndex: function(content) {
    const tab = '    ';
    this.config.commands.sort().forEach((command) => {
      const enrich = enriched.search(command);
      content += `${tab}- [${command} (${enrich.description})](#${this.runner._formatMdLink(`${command} ${enrich.description}`)})\n`;
    });
    return content;
  },

  _pluginsIndex: function(content) {
    const tab = '    ';

    Object.getOwnPropertyNames(this.config.recipes).forEach((recipeName) => {
      const recipe = this.config.recipes[recipeName];
      const dirPlugins = path.join(recipe.dir, 'plugins');
      if (recipe.name && this.fsExists(dirPlugins) && recipeName !== 'piscosour') {
        content += `${tab}- from **${recipe.name}  v.${recipe.version}**\n`;
        const plugins = fs.readdirSync(dirPlugins);
        plugins.sort().forEach((dir) => {
          content += `${tab}${tab}- [${dir}](#${dir})\n`;
        });
      }
    });
    return content;
  },

  _infoStraws: function(bundle) {
    Object.getOwnPropertyNames(enriched).sort().forEach((recipeKey) => {
      const recipe = enriched[recipeKey].___recipe;
      if (recipe) {
        if (recipeKey !== 'piscosour') {

          const iterable = Object.getOwnPropertyNames(enriched[recipeKey]).sort();
          iterable.forEach((command) => {
            const enrich = enriched[recipeKey][command];
            if (command !== '___recipe' && enrich.type === 'straw') {
              const straw = this.fsReadConfig(path.join(recipe.dir, 'straws', enrich.name, 'straw.json'));
              if (straw.type === 'normal') {
                this.runner._infoStraw(bundle, straw, enrich.name, command);
              }
            }
          });

          iterable.forEach((command) => {
            const enrich = enriched[recipeKey][command];
            if (command !== '___recipe' && enrich.type === 'shot') {
              this.runner._infoShot(bundle, command);
            }
          });
        }
      }
    });
  },

  _infoStraw: function(bundle, straw, name, command, p) {
    this.logger.info('#green', 'reading', 'straw', '#cyan', straw.name);
    let file = path.join('straws', name, 'info.md');
    let precontent = '[Go Index](#main-index):\n\n';
    precontent += `How to execute this command:\n\n`;
    precontent += `    ${this.config.cmd} ${command}\n\n`;
    bundle = this.runner._addBundle(`###${command} (${straw.description})`, file, bundle, true, precontent);

    let n = 1;
    Object.getOwnPropertyNames(straw.shots).forEach((shotName) => {
      const shot = straw.shots[shotName];
      this.logger.info('#green', 'reading', 'shot', '#cyan', shotName);
      shotName = shotName.indexOf(':') >= 0 ? shotName.split(':')[0] : shotName;
      if (shot.type === 'straw') {
        const strawShot = this.fsReadConfig(path.join('straws', shotName, 'straw.json'));
        this.runner._infoStraw(bundle, strawShot, shotName, '# ' + n + '. (Straw) ' + shotName, n);
      } else {
        this.runner._infoShot(bundle, `${command.split(':')[0]}:${shotName}`, '####', n, p);
      }
      n++;
    });
  },

  _infoShot: function(bundle, command, base, n, p) {
    let precontent = '';
    if (!base) {
      base = '###';
      precontent += '[Go Index](#main-index):\n\n';
      precontent += `How to execute this command:\n\n`;
      precontent += `    ${this.config.cmd} ${command}\n\n`;
    }
    precontent += 'General info:\n\n';

    const tmp = command.split(':');
    const shotName = tmp[tmp.length - 1];
    const info = this.config.getShotInfo(shotName);
    info.recipes.forEach((recipe) => {
      let file = path.join(recipe.dir, 'shots', shotName, 'info.md');
      bundle = this.runner._addBundle(`\n${base} ${(n ? (n + (p ? '.' + p : '') + '. ') : '')}${command} '${info.description}'`, file, bundle, true, `${precontent}${this.runner._infomd(info)}`);
      this.config.repoTypes.forEach((type) => {
        file = path.join(recipe.dir, 'shots', shotName, type, 'info.md');
        bundle = this.runner._addBundle('', file, bundle);
      });
    });
  },

  _infoRecipe: function() {
    let content = '[Go Index](#main-index):\n\n';
    content += '|Name|Version|Description|\n';
    content += '|---|---|---|\n';
    Object.getOwnPropertyNames(this.config.recipes).forEach((recipeName) => {
      const recipe = this.config.recipes[recipeName];
      if (recipe.name && recipe.version !== '-') {
        content += '|' + recipe.name + '|' + recipe.version + '|' + recipe.description + '|\n';
      }
    });
    return content;
  },

  _infoContexts: function() {
    let content = '[Go Index](#main-index):\n\n';
    content += '|Name|Description|\n';
    content += '|---|---|\n';
    Object.getOwnPropertyNames(this.params.contexts).forEach((context) => {
      content += '|' + context + '| |\n';
    });
    return content;
  },

  _infoPlugins: function(bundle) {
    Object.getOwnPropertyNames(this.config.recipes).forEach((recipeName) => {
      const recipe = this.config.recipes[recipeName];
      const dirPlugins = path.join(recipe.dir, 'plugins');
      if (recipe.name && this.fsExists(dirPlugins) && recipeName !== 'piscosour') {
        this.logger.info('#green', 'reading', dirPlugins);
        const plugins = fs.readdirSync(dirPlugins);

        plugins.forEach((dir) => {
          this.logger.info('processing plugin', '#cyan', dir, '...');
          const fileMd = path.join(recipe.dir, 'plugins', dir, 'info.md');
          let precontent = '';
          precontent += `from: **${recipe.name} (${recipe.version})**`;
          precontent += '  [Go Index](#main-index)\n';
          bundle = this.runner._addBundle('## ' + dir, fileMd, bundle, true, precontent);
        });
      }
    });
  },

  _infomd: function(info) {
    let r = '```\n';
    r += 'Contexts:';
    info.types.forEach((type, i, a) => {
      r += '  ' + type;
      if (i < a.length - 1) {
        r += ',';
      }
    });
    r += '\nFrom:';
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