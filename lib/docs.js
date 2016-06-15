'use strict';

const fs = require('fs');
const path = require('path');

const chalk = require('chalk');
const updateNotifier = require('update-notifier');

const analytics = require('./analytics');
const config = require('./config');
const logger = require('./logger');
const disclaimer = require('./disclaimer');
const fsUtils = require('./utils/fsUtils');
const params = require('./params');
const pkgPisco = require('../package.json');


const recipeDir = config.getDir('module');
const pkg = require(path.join(recipeDir, 'package.json'));
const notifier = updateNotifier({pkg, updateCheckInterval: 1});

/**
 * Module used for CLI help. Shows all CLI commands and options.
 * @module docs
 */
const docs = {

  cmdOptions: {
    'junitReport': 'write junit report at the end',
    'initShot': 'from shot : ' + config.cmd + ' -i <shotname>',
    'endShot': 'to shot : ' + config.cmd + ' -e <shotname>',
    'help': 'shows detailed info of a command: ' + config.cmd + ' -h <command>',
    'all': 'list all commands availables (context:straw[:shot])',
    'list': 'list piscosour elements',
    'output': 'set output level : "' + config.cmd + ' -ov" -> set to verbose',
    'paramsFile': 'json file with a set of parameters',
    'version': 'show version'
  },

  version: function() {
    analytics.hit('/version', `showing version ${pkg.version}`);
    logger.txt(pkg.version);
  },

  showDisclaimer: function(cb) {
    if (config.recipes.module.config.analytics &&
      (!config.recipes.userConfig ||
      !config.recipes.userConfig.config ||
      !config.recipes.userConfig.config.analytics ||
      !config.recipes.userConfig.config.analytics.userok ||
      config.recipes.userConfig.config.analytics.userok[pkg.name] === undefined)) {
      if (config.recipes.module.config.analytics.ask) {
        const prompts = [
          {
            type: 'confirm',
            name: 'disclaimer',
            message: `Do you want '${pkg.name}' to report usage statistics to google analytics?`
          }
        ];
        require('inquirer').prompt(prompts, (answers) => {
          if (answers.disclaimer) {
            disclaimer.ok(pkg.name);
          } else {
            disclaimer.ko(pkg.name);
          }
          docs.auto(cb);
        });
      } else {
        disclaimer.ok(pkg.name);
        docs.auto(cb);
      }
      return false;
    } else {
      return true;
    }
  },

  help: function(normal, cb) {
    logger.trace('#green', 'docs:help', 'normal:', normal);
    if (docs.showDisclaimer(cb)) {
      if (normal.name) {
        docs.info(normal);
      } else if (params.help || params.all || params.list) {
        docs.index();
      } else {
        docs.auto(cb);
      }
    }
  },

  info: function(normal) {
    analytics.hit(`/help/${normal.context}:${normal.name}`, `Showing help of command: ${normal.context}:${normal.name}`);
    logger.trace('#green', 'docs:info', 'isShot:', normal.isShot, normal.orig);
    if (normal.isShot) {
      logger.txt('\n ', 'Shot', '[', chalk.bold(normal.orig), ']', '\n');
      logger.parseMd(path.join(recipeDir, 'shots', normal.name, 'info.md'), path.join(recipeDir, 'shots', normal.name, normal.context, 'info.md'));
    } else {
      const strawObj = config.getStraw(normal);
      logger.txt('\n ', chalk.bold(strawObj.name + ':'), '[', normal.context + ':' + normal.name, ']', '(', strawObj.description, ')');
      logger.parseMd(path.join(recipeDir, 'straws', normal.name, 'info.md'));
      logger.txt('\n', chalk.bold.green('shots'), '(steps on the workflow)\n');
      const shots = [];
      for (const shot in strawObj.shots) {
        if (strawObj.shots[shot].type === 'straw') {
          const normalTmp = JSON.parse(JSON.stringify(normal));
          normalTmp.name = shot;
          logger.txt('\n', chalk.yellow('## Straw ----'), '\n');
          logger.txt('', chalk.cyan.bold(shot), 'is a straw');
          this.info(normalTmp);
          logger.txt('\n', chalk.yellow('## End straw ----'), '\n');
        } else {
          logger.txt('', chalk.cyan.bold(shot + ':'), '\n');
          logger.parseMd(path.join(recipeDir, 'shots', shot, 'info.md'), path.join(recipeDir, 'shots', shot, normal.context, 'info.md'));
        }
      }
    }
  },

  auto: function(cb) {
    analytics.hit('/index', 'Context Menu');
    const inquirer = require('inquirer');
    const context = require('./context');
    const ami = context.whoami(params.workingDir ? params.workingDir : config.params.workingDir);

    inquirer.prompt(docs.getPrompts(ami), function(answers) {
      logger.trace('Commmands answers: ', answers);
      if (answers.command === 'help' || answers.shot === 'help') {
        docs.index();
      } else if (answers.command !== 'exit' && answers.shot !== 'exit') {
        cb(answers);
      }
    });
  },

  getPrompts: function(ami) {
    const prompts = [];
    prompts[0] = {
      type: 'list',
      name: 'command',
      message: 'What\'s up!?' + (ami.length > 0 ? ' (You are inside a ' + ami + ')' : ''),
      choices: []
    };
    prompts[1] = {
      type: 'list',
      name: 'shot',
      message: 'So you want more!!, What\'s up!?',
      choices: [],
      when: function(answers) {
        return answers.command === 'shots';
      }
    };

    if (notifier.update && notifier.update.latest !== notifier.update.current) {
      prompts[0].choices.push({
        value: 'recipe::updateversion',
        name: '-----------------------------------' +
        '\n    Update available ' + chalk.grey(notifier.update.current) + ' -> ' + chalk.green(notifier.update.latest) +
        '\n    npm install -g ' + chalk.green(pkg.name) +
        '\n  -----------------------------------'
      });
    }

    const enriched = docs.enrichCommands(ami);

    const setPrompts = function(_prompts, enrich, command) {
      if (!enrich) {
        return _prompts;
      }
      if (enrich.type === 'shot') {
        _prompts[1].choices.push({
          value: command,
          name: command + chalk.yellow(' (' + enrich.description + ')')
        });
      } else {
        _prompts[0].choices.push({
          value: command,
          name: command + chalk.yellow(' (' + enrich.description + ')')
        });
      }
      return _prompts;
    };

    if (config.recipes.module.config && config.recipes.module.config.commands) {
      config.recipes.module.config.commands.forEach((command) => {
        setPrompts(prompts, enriched.search(command), command);
      });
    } else {
      Object.getOwnPropertyNames(enriched).forEach((recipeKey) => {
        if (enriched[recipeKey].___recipe) {
          Object.getOwnPropertyNames(enriched[recipeKey]).forEach((command) => {
            if (command !== '___recipe') {
              setPrompts(prompts, enriched[recipeKey][command], command);
            }
          });
        }
      });
    }

    if (prompts[1].choices.length !== 0) {
      prompts[0].choices.push({
        value: 'shots',
        name: 'More commands'
      });
    }

    const help = {
      value: 'help',
      name: 'Get help'
    };

    const exit = {
      value: 'exit',
      name: 'Exit'
    };

    prompts[0].choices.push(help);
    prompts[1].choices.push(help);
    prompts[0].choices.push(exit);
    prompts[1].choices.push(exit);

    return prompts;
  },

  /**
   * Return all the straws/shots available for the project.
   * read first the local lifecycles file
   */
  index: function() {
    analytics.hit('/help', 'Show help');
    logger.trace('#green', 'docs:index');
    logger.txt('\n', chalk.bold('Name') + ':', pkg.name, pkg.version, (pkg.name !== pkgPisco.name ? '(' + pkgPisco.name + ' ' + pkgPisco.version + ')' : ''), '-', pkg.description);
    logger.txt('', chalk.bold('Usage') + ':', config.cmd, '[Command] [Options...]');

    docs.showCommands((params.all || config.commads) ? 'All commands:' : 'User Commands:', params.all);

    logger.txt('');

    docs.showOptions('Options:');
    docs.showRecipes('Recipes availables:', params.list === 'all' || params.list === 'recipes');
    docs.showStraws('Piscosour utils:', [ 'internal' ], true, params.list === 'all');
    docs.showRepos('Repository Types availables:', params.list === 'all' || params.list === 'contexts');
    docs.showStraws('Straws availables:', ['normal', 'parallel'], true, params.list === 'all' || params.list === 'straws');
    docs.showShots('Shots availables:', params.list === 'all' || params.list === 'shots');
    logger.txt('\n');
  },

  showCommands: function(title, forceAll) {
    if (title !== null) {
      logger.txt('\n', chalk.bold(title), '\n');
    }

    const enriched = docs.enrichCommands(null, true);

    if (config.recipes.module.config && config.recipes.module.config.commands && !forceAll) {
      config.recipes.module.config.commands.forEach((command) => {
        const enrich = enriched.search(command);
        if (enrich) {
          logger.txt('\t', chalk.bold(command), '(', chalk.yellow(enrich.description), ')', enrich.type === 'shot' ? (' - ' + chalk.grey('Shot')) : '');
        }
      });
    } else {
      Object.getOwnPropertyNames(enriched).forEach((recipeKey) => {
        const recipe = enriched[recipeKey].___recipe;
        if (recipe) {
          logger.txt('\n\t', chalk.cyan.bold('from ' + recipe.name + ' v.' + recipe.version), '\n');
          Object.getOwnPropertyNames(enriched[recipeKey]).forEach((command) => {
            if (command !== '___recipe') {
              const enrich = enriched[recipeKey][command];
              logger.txt('\t  ', chalk.bold(command), '(', chalk.yellow(enrich.description), ')', enrich.type === 'shot' ? (' - ' + chalk.grey('Shot')) : '');
            }
          });
        }
      });
    }
  },

  enrichCommands: function(ami, nocontext) {

    const enriched = {
      search: function(command) {
        for (const name in this) {
          if (this[name][command]) {
            return this[name][command];
          }
        }
      }
    };

    const mustBeInStraw = function(must, shots, type) {
      for (const name in shots) {
        if (must[name + '-' + type] || must[name + '-default']) {
          return true;
        }
      }

      return false;
    };

    const noAmi = !ami || ami.length === 0;
    const mustBeInShots = {};

    // shots
    Object.getOwnPropertyNames(config.recipes).forEach((recipeKey) => {
      const recipe = config.recipes[recipeKey];
      if (recipe.name && recipe.shots) {
        Object.getOwnPropertyNames(recipe.shots).forEach((name) => {
          const shot = recipe.shots[name];
          Object.getOwnPropertyNames(shot).forEach((type) => {
            const command = (type === 'default' ? 'all' : type) + '::' + name;
            if (!shot[type].contextFree) {
              mustBeInShots[name + '-' + type] = true;
            }
            if (!(shot.default ? shot.default.isTest : false)) {
              if (!enriched[recipeKey]) {
                enriched[recipeKey] = {___recipe: recipe};
              }

              if (nocontext || noAmi && shot[type].contextFree || (ami && ami.indexOf(type) >= 0) && !shot[type].contextFree) {
                enriched[recipeKey][command] = {
                  description: shot[type].description,
                  type: 'shot'
                };
              }
            }
          });
        });
      }
    });

    // straws
    Object.getOwnPropertyNames(config.recipes).forEach((recipeKey) => {
      const recipe = config.recipes[recipeKey];
      if (recipe.name && recipe.straws) {
        Object.getOwnPropertyNames(recipe.straws).forEach((name) => {
          const straw = recipe.straws[name];
          const types = config.getContexts(straw, recipeKey);
          types.forEach((type) => {
            const command = (type === 'default' ? 'all' : type) + ':' + name;
            const mustBeIn = mustBeInStraw(mustBeInShots, straw.shots, type);
            if (straw.type === 'normal' && (nocontext || noAmi && !mustBeIn || (ami && ami.indexOf(type) >= 0) && mustBeIn)) {

              if (!enriched[recipeKey]) {
                enriched[recipeKey] = {___recipe: recipe};
              }

              enriched[recipeKey][command] = {
                description: straw.description,
                type: 'straw'
              };
            }
          });
        });
      }
    });
    return enriched;
  },

  showOptions: function(title) {
    logger.txt('', chalk.bold(title), '\n');
    Object.getOwnPropertyNames(params.knownOpts).forEach((ops) => {
      logger.txt('\t', chalk.bold('--' + ops), params.info(ops), ': ', docs.cmdOptions[ops]);
    });
  },

  showRecipes: function(title, isShown) {
    if (Object.keys(config.recipes).length > 0 && isShown) {
      logger.txt('\n', chalk.bold(title), '\n');
      let i = 0;
      Object.getOwnPropertyNames(config.recipes).forEach((name) => {
        const recipe = config.recipes[name];
        if (recipe.name) {
          logger.txt('\t', (parseInt(i) + 1), '-', chalk.bold(recipe.name), '(', recipe.version, ')', '-', recipe.description);
          i++;
        }
      });
    }
  },

  showRepos: function(title, isShown) {
    if (isShown) {
      logger.txt('\n', chalk.bold(title), '\n');
      Object.getOwnPropertyNames(config.contexts).forEach((repo, i) => {
        logger.txt('\t', (parseInt(i) + 1), '-', chalk.bold(repo), (repo === config.defaultType ? chalk.cyan('(default)') : ''));
      });
    }
  },

  showShots: function(title, isShown) {
    if (isShown) {
      logger.txt('\n', chalk.bold(title), '\n');
      let i = 0;
      Object.getOwnPropertyNames(config.shots).forEach((name) => {
        if (!config.shots[name].default || !config.shots[name].default.isTest) {
          logger.txt('\t', (parseInt(i) + 1), '-', chalk.bold(name));
          i++;
        }
      });
    }
  },

  showStraws: function(title, strawTypes, showShots, isShown) {
    if (isShown) {
      const straws = docs.filterStraws(config.straws, strawTypes);
      if (Object.keys(straws).length > 0) {
        logger.txt('\n', chalk.bold(title), '\n');
        Object.getOwnPropertyNames(straws).forEach((name) => {
          const straw = straws[name];
          logger.txt('\t[', chalk.bold(name), ']', chalk.green(straw.name) + ': (', chalk.yellow(straw.description), ')');
          if (straw.shots && showShots) {
            logger.txt('\t', chalk.cyan('shots:'), Object.keys(straw.shots).toString(), '\n');
          }
        });
      }
    }
  },

  filterStraws: function(straws, types) {
    const res = {};
    Object.getOwnPropertyNames(straws).forEach((name) => {
      const straw = straws[name];
      if (types.indexOf(straw.type) >= 0) {
        res[name] = straw;
      }
    });
    return res;
  }
};

module.exports = docs;
