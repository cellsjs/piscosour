'use strict';

const fs = require('fs');
const path = require('path');
const docs = require('../../lib/docs');
const enriched = docs.enrichCommands(null, true);

module.exports = {

  pkg: {},

  run: function() {
    this.pkg = this.fsReadConfig(this.pkgFile);

    let bundle = [];

    bundle = this._addBundle(this._menu(), null, bundle);
    bundle = this._addBundle('# All Commands Availables', null, bundle);
    this._infoFlows(bundle);
    bundle = this._addBundle('\n# Plugins', null, bundle);
    this._infoPlugins(bundle);
    bundle = this._addBundle('# Contexts', null, bundle);
    bundle = this._addBundle(this._infoContexts(), null, bundle);
    bundle = this._addBundle('# Recipes', null, bundle);
    bundle = this._addBundle(this._infoRecipe(), null, bundle);

    this.fsAppendBundle(bundle, 'README.md', ' Main Index:');
  },

  _menu() {
    let content = '';
    if (this.piscoConfig.get().commands) {
      content += '- User Commands\n';
      content = this._userCommandsIndex(content);
    }
    content += `- [All Commands Availables](#all-commands-availables)\n`;
    content = this._commandsIndex(content);
    content += '- [Plugins](#plugins)\n';
    content = this._pluginsIndex(content);
    content += '- [Contexts](#contexts)\n';
    content += '- [Recipes](#recipes)\n';
    return content;
  },

  _getStarted: function() {
    let content = `Install ${this.pkg.name} globally\n\n`;
    content += `    npm install -g ${this.pkg.name}`;
    content += `\n\nOnce installed, ${this.piscoConfig.get().cmd} command will be available for you`;
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
          ['flow', 'step'].forEach((type) => {
            iterable.forEach((command) => {
              const enrich = enriched[recipeKey][command];
              if (command !== '___recipe' && enrich.type === type) {
                const piscoCfg = this.fsReadConfig(this.piscoFile);
                content += `${tab}${tab}- [${command} (${enrich.description})](#${this._formatMdLink(`${command} ${enrich.description}`)})\n`;
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
    this.piscoConfig.commands.sort().forEach((command) => {
      const enrich = enriched.search(command);
      if (enrich) {
        content += `${tab}- [${command} (${enrich.description})](#${this._formatMdLink(`${command} ${enrich.description}`)})\n`;
      }
    });
    return content;
  },

  _pluginsIndex: function(content) {
    const tab = '    ';

    Object.getOwnPropertyNames(this.piscoConfig.get().recipes).forEach((recipeName) => {
      const recipe = this.piscoConfig.get().recipes[recipeName];
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

  _infoFlows: function(bundle) {
    Object.getOwnPropertyNames(enriched).sort().forEach((recipeKey) => {
      const recipe = enriched[recipeKey].___recipe;
      if (recipe) {
        if (recipeKey !== 'piscosour') {

          const iterable = Object.getOwnPropertyNames(enriched[recipeKey]).sort();
          iterable.forEach((command) => {
            const enrich = enriched[recipeKey][command];
            if (command !== '___recipe' && enrich.type === 'flow') {
              const flow = this.fsReadConfig(path.join(recipe.dir, 'flows', enrich.name, 'config.json'));
              if (flow.type === 'normal') {
                this._infoFlow(bundle, flow, enrich.name, command);
              }
            }
          });

          iterable.forEach((command) => {
            const enrich = enriched[recipeKey][command];
            if (command !== '___recipe' && enrich.type === 'step') {
              this._infoStep(bundle, command);
            }
          });
        }
      }
    });
  },

  _infoFlow: function(bundle, flow, name, command, p) {
    this.logger.info('#green', 'reading', 'flow', '#cyan', flow.name);
    let file = path.join('flows', name, 'info.md');
    let precontent = '[Go Index](#main-index):\n\n';
    precontent += `How to execute this command:\n\n`;
    precontent += `    ${this.piscoConfig.get().cmd} ${command}\n\n`;
    bundle = this._addBundle(`###${command} (${flow.description})`, file, bundle, true, precontent);

    let n = 1;
    if (flow.steps) {
      Object.getOwnPropertyNames(flow.steps).forEach((stepName) => {
        const step = flow.steps[stepName];
        this.logger.info('#green', 'reading', 'step', '#cyan', stepName);
        stepName = stepName.indexOf(':') >= 0 ? stepName.split(':')[0] : stepName;
        if (step.type === 'flow') {
          const flowStep = this.fsReadConfig(path.join('flows', stepName, 'config.json'));
          this._infoFlow(bundle, flowStep, stepName, '# ' + n + '. (Flow) ' + stepName, n);
        } else {
          this._infoStep(bundle, `${command.split(':')[0]}:${stepName}`, '####', n, p);
        }
        n++;
      });
    }
  },

  _infoStep: function(bundle, command, base, n, p) {
    let precontent = '';
    if (!base) {
      base = '###';
      precontent += '[Go Index](#main-index):\n\n';
      precontent += `How to execute this command:\n\n`;
      precontent += `    ${this.piscoConfig.get().cmd} ${command}\n\n`;
    }
    precontent += 'General info:\n\n';

    const tmp = command.split(':');
    const stepName = tmp[tmp.length - 1];
    const info = this.piscoConfig.getStepInfo(stepName);
    info.recipes.forEach((recipe) => {
      let file = path.join(recipe.dir, 'steps', stepName, 'info.md');
      bundle = this._addBundle(`\n${base} ${(n ? (n + (p ? '.' + p : '') + '. ') : '')}${command} '${info.description}'`, file, bundle, true, `${precontent}${this._infomd(info)}`);
    });
  },

  _infoRecipe: function() {
    let content = '[Go Index](#main-index):\n\n';
    content += '|Name|Version|Description|\n';
    content += '|---|---|---|\n';
    Object.getOwnPropertyNames(this.piscoConfig.get().recipes).forEach((recipeName) => {
      const recipe = this.piscoConfig.get().recipes[recipeName];
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
    Object.getOwnPropertyNames(this.piscoConfig.get().contexts).forEach((context) => {
      content += `|${this.piscoConfig.get().contexts[context].name}|${this.piscoConfig.get().contexts[context].description}|\n`;
    });
    return content;
  },

  _infoPlugins: function(bundle) {
    Object.getOwnPropertyNames(this.piscoConfig.get().recipes).forEach((recipeName) => {
      const recipe = this.piscoConfig.get().recipes[recipeName];
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
          bundle = this._addBundle('## ' + dir, fileMd, bundle, true, precontent);
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
