'use strict';

const path = require('path');

const chalk = require('chalk');
const updateNotifier = require('update-notifier');

const analytics = require('./analytics');
const config = require('./config');
const logger = require('./logger');
const disclaimer = require('./disclaimer');
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
    'initStep': 'from step : ' + config.cmd + ' -i <stepname>',
    'endStep': 'to step : ' + config.cmd + ' -e <stepname>',
    'help': 'shows detailed info of a command: ' + config.cmd + ' -h <command>',
    'all': 'list all commands availables (context:flow[:step])',
    'list': 'list piscosour elements',
    'output': 'set output level : "' + config.cmd + ' -ov" -> set to verbose',
    'paramsFile': 'json file with a set of parameters',
    'writeCache': 'writes global config cache',
    'showContext': 'shows the pisco context of this dir',
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
      if (config.recipes.module.config.analytics.ask && !params.uuid) {
        const prompts = [
          {
            type: 'confirm',
            name: 'disclaimer',
            message: `Do you want '${pkg.name}' to report usage statistics to google analytics?`
          }
        ];
        require('inquirer').prompt(prompts).then((answers) => {
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

  _showStepMd: function(normal) {
    const tmp = config.getStepInfo(normal.name);
    if (tmp.recipes) {
      tmp.recipes.forEach((recipe) => {
        logger.parseMd(path.join(recipe.dir, 'steps', normal.name, 'info.md'));
      });
    }
  },

  info: function(normal) {
    analytics.hit(`/help/${normal.context}:${normal.name}`, `Showing help of command: ${normal.context}:${normal.name}`);
    logger.trace('#green', 'docs:info', 'isStep:', normal.isStep, normal.orig);
    if (normal.isStep) {
      logger.txt('\n ', 'Step', '[', chalk.bold(normal.orig), ']', '\n');
      this._showStepMd(normal);
    } else {
      const flowObj = config.getFlow(normal);
      logger.txt('\n ', chalk.bold(flowObj.name + ':'), '[', normal.context + ':' + normal.name, ']', '(', flowObj.description, ')');
      if (flowObj.recipe) {
        logger.parseMd(path.join(flowObj.recipe.dir, 'straws', normal.name, 'info.md'));
      }
      const steps = [];

      Object.getOwnPropertyNames(flowObj.steps).forEach((step) => {
        const normalTmp = JSON.parse(JSON.stringify(normal));
        normalTmp.name = step;
        if (flowObj.steps[step].type === 'flow') {
          logger.txt('\n', chalk.yellow('## Flow ----'), '\n');
          logger.txt('', chalk.cyan.bold(step), 'is a flow');
          this.info(normalTmp);
          logger.txt('\n', chalk.yellow('## End flow ----'), '\n');
        } else {
          logger.txt('', chalk.cyan.bold(step + ':'), '\n');
          this._showStepMd(normalTmp);
        }
      });
    }
  },

  auto: function(cb) {
    analytics.hit('/index', 'Context Menu');
    const inquirer = require('inquirer');
    const context = require('./context');
    const ami = context.whoami(params.workingDir ? params.workingDir : config.params.workingDir);

    inquirer.prompt(docs.getPrompts(ami)).then(function(answers) {
      logger.trace('Commmands answers: ', answers);
      if (answers.command === 'help' || answers.step === 'help') {
        docs.index();
      } else if (answers.command !== 'exit' && answers.step !== 'exit') {
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
      name: 'step',
      message: 'So you want more!!, What\'s up!?',
      choices: [],
      when: function(answers) {
        return answers.command === 'steps';
      }
    };

    if (notifier.update && notifier.update.latest !== notifier.update.current) {
      prompts[0].choices.push({
        value: 'recipe::update',
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
      if (enrich.type === 'step') {
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
        value: 'steps',
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
   * Return all the flows/steps available for the project.
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
    docs.showRecipes('Recipes:', params.list === 'all' || params.list === 'recipes');
    docs.showFlows('Piscosour utils:', [ 'internal' ], true, params.list === 'all');
    docs.showRepos('Contexts:', params.list === 'all' || params.list === 'contexts');
    docs.showFlows('Flows:', ['normal', 'parallel'], true, params.list === 'all' || params.list === 'flows');
    docs.showSteps('Steps:', params.list === 'all' || params.list === 'steps');
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
          logger.txt('\t', chalk.bold(command), '(', chalk.yellow(enrich.description), ')', enrich.type === 'step' ? (' - ' + chalk.grey('Step')) : '');
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
              logger.txt('\t  ', chalk.bold(command), '(', chalk.yellow(enrich.description), ')', enrich.type === 'step' ? (' - ' + chalk.grey('Step')) : '');
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

    const mustBeInFlow = function(must, steps, type) {
      for (const name in steps) {
        if (must[name + '-' + type] || must[name + '-default'] || steps[name][type] && steps[name][type].requires || steps[name].default && steps[name].default.requires) {
          return true;
        }
      }

      return false;
    };

    const noAmi = !ami || ami.length === 0;
    const mustBeInSteps = {};

    // steps
    Object.getOwnPropertyNames(config.recipes).forEach((recipeKey) => {
      const recipe = config.recipes[recipeKey];
      if (recipe.name && recipe.steps) {
        Object.getOwnPropertyNames(recipe.steps).forEach((name) => {
          const step = recipe.steps[name];
          Object.getOwnPropertyNames(step).forEach((type) => {
            const command = (type === 'default' ? 'all' : type) + '::' + name;
            if (!step[type].isGenerator && type !== 'default') {
              mustBeInSteps[name + '-' + type] = true;
            }
            if (!(step.default ? step.default.isTest : false)) {
              if (!enriched[recipeKey]) {
                enriched[recipeKey] = {___recipe: recipe};
              }

              if (nocontext || noAmi && step[type].isGenerator || (ami && (ami.indexOf(type) >= 0 || type === 'default')) && !step[type].isGenerator) {
                enriched[recipeKey][command] = {
                  description: step[type].description,
                  type: 'step',
                  name: name
                };
              }
            }
          });
        });
      }
    });

    // flows
    Object.getOwnPropertyNames(config.recipes).forEach((recipeKey) => {
      const recipe = config.recipes[recipeKey];
      if (recipe.name && recipe.flows) {
        Object.getOwnPropertyNames(recipe.flows).forEach((name) => {
          const flow = recipe.flows[name];
          const types = config.getContexts(flow, recipeKey);
          types.forEach((type) => {
            const command = (type === 'default' ? 'all' : type) + ':' + name;
            const mustBeIn = mustBeInFlow(mustBeInSteps, flow.steps, type) && !flow.isGenerator;
            if (flow.type === 'normal' && (nocontext || noAmi && !mustBeIn || (ami && ami.indexOf(type) >= 0) && mustBeIn)) {

              if (!enriched[recipeKey]) {
                enriched[recipeKey] = {___recipe: recipe};
              }

              enriched[recipeKey][command] = {
                description: flow.description,
                type: 'flow',
                name: name
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
        logger.txt('\t', (parseInt(i) + 1), '-', chalk.bold(repo), (repo === config.defaultContext ? chalk.cyan('(default)') : ''));
      });
    }
  },

  showSteps: function(title, isShown) {
    if (isShown) {
      logger.txt('\n', chalk.bold(title), '\n');
      let i = 0;
      Object.getOwnPropertyNames(config.steps).forEach((name) => {
        if (!config.steps[name].default || !config.steps[name].default.isTest) {
          logger.txt('\t', (parseInt(i) + 1), '-', chalk.bold(name));
          i++;
        }
      });
    }
  },

  showFlows: function(title, flowTypes, showSteps, isShown) {
    if (isShown) {
      const flows = docs.filterFlows(config.flows, flowTypes);
      if (Object.keys(flows).length > 0) {
        logger.txt('\n', chalk.bold(title), '\n');
        Object.getOwnPropertyNames(flows).forEach((name) => {
          const flow = flows[name];
          logger.txt('\t[', chalk.bold(name), ']', chalk.green(flow.name) + ': (', chalk.yellow(flow.description), ')');
          if (flow.steps && showSteps) {
            logger.txt('\t', chalk.cyan('steps:'), Object.keys(flow.steps).toString(), '\n');
          }
        });
      }
    }
  },

  filterFlows: function(flows, types) {
    const res = {};
    Object.getOwnPropertyNames(flows).forEach((name) => {
      const flow = flows[name];
      if (types.indexOf(flow.type) >= 0) {
        res[name] = flow;
      }
    });
    return res;
  }
};

module.exports = docs;
