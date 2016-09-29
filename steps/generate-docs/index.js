'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');

const docs = require('../../lib/docs');

const enriched = docs.enrichCommands(null, true);
const tab = '    ';

module.exports = {

  config: function() {
    this.params.pkg = this.fsReadConfig(this.pkgFile);
    this.params.recipeName = this.params.pkg.name;
    this.params.piscoConfig = this.piscoConfig.get();

    this.params.recipe = _.find(this.params.piscoConfig.recipes, obj => obj.name === this.params.recipeName);
    this.params.enriched = _.find(enriched, obj => obj.___recipe && obj.___recipe.name === this.params.recipeName) || {};
  },

  run: function() {
    let bundle = [];

    bundle = this._addBundle(this._menu(), null, bundle);
    bundle = this._addBundle('# Available Commands', null, bundle);
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
    if (this.params.recipe.commands) {
      content += '- User Commands\n';
      content = this._userCommandsIndex(content);
    }
    content += `- [Available Commands](#available-commands)\n`;
    content = this._commandsIndex(content);
    content += '- [Plugins](#plugins)\n';
    content = this._pluginsIndex(content);
    content += '- [Contexts](#contexts)\n';
    content += '- [Recipes](#recipes)\n';
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
    const recipe = this.params.enriched.___recipe;
    if (recipe) {
      content += `${tab}- from **${recipe.name}  v.${recipe.version}**\n`;
      const iterable = Object.getOwnPropertyNames(this.params.enriched).sort();
      ['flow', 'step'].forEach((type) => {
        iterable.forEach((command) => {
          const enrich = this.params.enriched[command];
          if (command !== '___recipe' && enrich.type === type) {
            content += `${tab}${tab}- [${command} (${enrich.description})](#${this._formatMdLink(`${command} ${enrich.description}`)})\n`;
          }
        });
      });
    }
    return content;
  },

  _userCommandsIndex: function(content) {
    const recipe = this.params.recipe;
    if (recipe.config.commands) {
      recipe.config.commands.sort().forEach((command) => {
        const enrich = enriched.search(command);
        if (enrich) {
          content += `${tab}- [${command} (${enrich.description})](#${this._formatMdLink(`${command} ${enrich.description}`)})\n`;
        }
      });
    }
    return content;
  },

  _pluginsIndex: function(content) {
    const recipe = this.params.recipe;
    const dirPlugins = path.join(recipe.dir, 'plugins');
    if (recipe.name && this.fsExists(dirPlugins)) {
      content += `${tab}- from **${recipe.name}  v.${recipe.version}**\n`;
      const plugins = fs.readdirSync(dirPlugins);
      plugins.sort().forEach((dir) => {
        content += `${tab}${tab}- [${dir}](#${dir})\n`;
      });
    }
    return content;
  },

  _infoFlows: function(bundle) {
    const recipe = this.params.enriched.___recipe;
    if (recipe) {
      const iterable = Object.getOwnPropertyNames(this.params.enriched).sort();
      iterable.forEach((command) => {
        const enrich = this.params.enriched[command];
        if (command !== '___recipe' && enrich.type === 'flow') {
          const flow = this.fsReadConfig(path.join(recipe.dir, 'flows', enrich.name, 'config.json'));
          if (flow.type === 'normal') {
            this._infoFlow(bundle, flow, enrich.name, command);
          }
        }
      });

      iterable.forEach((command) => {
        const enrich = this.params.enriched[command];
        if (command !== '___recipe' && enrich.type === 'step') {
          this._infoStep(bundle, command);
        }
      });
    }
  },

  _infoFlow: function(bundle, flow, name, command, p) {
    this.logger.info('#green', 'reading', 'flow', '#cyan', flow.name);
    let file = path.join('flows', name, 'info.md');
    let precontent = '[[Index]](#main-index)\n\n';
    bundle = this._addBundle(`## ${command} (${flow.description})\n`, file, bundle, true, precontent);

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
      base = '##';
      precontent += '[[Index]](#main-index)\n\n';
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
    let content = '[[Index]](#main-index)\n\n';
    content += '|Name|Version|Description|\n';
    content += '|---|---|---|\n';

    const recipe = this.params.recipe;
    if (recipe.name && recipe.version !== '-') {
      content += '|' + recipe.name + '|' + recipe.version + '|' + recipe.description + '|\n';
    }
    return content;
  },

  _infoContexts: function() {
    let content = '';
    if (this.params.recipe.contexts && this.params.recipe.contexts.length > 0) {
      content = '[[Index]](#main-index)\n\n';
      content += '|Name|Description|\n';
      content += '|---|---|\n';
      Object.getOwnPropertyNames(this.params.recipe.contexts).forEach((context) => {
        content += `|${this.params.recipe.contexts[context].name}|${this.params.recipe.contexts[context].description}|\n`;
      });
    }
    return content;
  },

  _infoPlugins: function(bundle) {
    const recipe = this.params.recipe;
    const dirPlugins = path.join(recipe.dir, 'plugins');
    if (recipe.name && this.fsExists(dirPlugins)) {
      this.logger.info('#green', 'reading', dirPlugins);
      const plugins = fs.readdirSync(dirPlugins);

      plugins.forEach((dir) => {
        this.logger.info('processing plugin', '#cyan', dir, '...');
        const fileMd = path.join(recipe.dir, 'plugins', dir, 'info.md');
        let precontent = '';
        precontent += `from: **${recipe.name}(${recipe.version})**`;
        precontent += '  [[Index]](#main-index)\n';
        bundle = this._addBundle('## ' + dir, fileMd, bundle, true, precontent);
      });
    }
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
