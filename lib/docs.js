/*jshint node:true */

'use strict';

var params = require('./params'),
    logger = require('./logger'),
    config = require('./config'),
    fsUtils = require('./utils/fsUtils'),
    path = require('path'),
    fs = require('fs'),
    recipeDir = config.getDir("module"),
    pkg = require(path.join(recipeDir, 'package.json')),
    pkgPisco = require('../package.json'),
    chalk = require('chalk');

//TODO: Hacer listado de comandos y de elementos piscosour por receta. Esta preparado.
//TODO: Comprobar tipos de repositorio cuando un shot es de tipo straw.
//TODO: mostrar la ayuda por cada comando (info()), sacando del info.md de cada straw o shot

/**
 * Module used for CLI help. Shows all CLI commands and options.
 * @module docs
 */
var docs = {

    cmdOptions: {
        "junitReport": "write junit report at the end",
        "initShot": "from shot : " + config.cmd + " -i <shotname>",
        "endShot": "to shot : " + config.cmd + " -e <shotname>",
        "help": "shows detailed info of a command: " + config.cmd + " -h <command>",
        "all": "list all commands availables (repoType:straw[:shot])",
        "list": "list piscosour elements",
        "output": "set output level : '" + config.cmd + " -ov' -> set to verbose",
        "version": "show version"
    },

    help: function (normal) {
        logger.trace("#green", "docs:help", "normal:", normal);
        if (!normal.name) {
            docs.index();
        } else {
            docs.info(normal);
        }
    },

    info: function (normal) {
        logger.trace("#green", "docs:info", "isShot:", normal.isShot, normal.orig);
        if (normal.isShot) {
            logger.txt("\n ", "Shot", "[", chalk.bold(normal.orig), "]", "\n");
            logger.parseMd(path.join(recipeDir, 'shots', normal.name, 'info.md'), path.join(recipeDir, 'shots', normal.name, normal.repoType, 'info.md'));
        } else {
            var strawObj = config.getStraw(normal);
            logger.txt("\n ", chalk.bold(strawObj.name + ":"), "[", normal.repoType + ":" + normal.name, "]", "(", strawObj.description, ")");
            logger.parseMd(path.join(recipeDir, 'straws', normal.name, 'info.md'));
            logger.txt("\n", chalk.bold.green("shots"), "(steps on the workflow)\n");
            var shots = [];
            for (var shot in strawObj.shots) {
                if (strawObj.shots[shot].type === 'straw') {
                    var normalTmp = JSON.parse(JSON.stringify(normal));
                    normalTmp.name = shot;
                    logger.txt("\n", chalk.yellow("## Straw ----"), "\n");
                    logger.txt("", chalk.cyan.bold(shot), "is a straw");
                    this.info(normalTmp);
                    logger.txt("\n", chalk.yellow("## End straw ----"), "\n");
                } else {
                    logger.txt("", chalk.cyan.bold(shot + ":"), "\n");
                    logger.parseMd(path.join(recipeDir, 'shots', shot, 'info.md'), path.join(recipeDir, 'shots', shot, normal.repoType, 'info.md'));
                }
            }
        }
    },

    /**
     * Return all the straws/shots available for the project.
     * read first the local lifecycles file
     */
    index: function () {
        logger.trace("#green", "docs:index");
        logger.txt("\n", chalk.bold("Name") + ":", pkg.name, pkg.version, (pkg.name !== pkgPisco.name ? "(" + pkgPisco.name + " " + pkgPisco.version + ")" : ""), "-", pkg.description);
        logger.txt("", chalk.bold("Usage") + ":", config.cmd, "[Command] [Options...]");

        if (params.all || !config.commands)
            docs.showCommands("All commands:");
        else
            docs.showUserCommands("User Commands:");

        logger.txt("");

        docs.showOptions("Options:");

        if (params.list === "all" || params.list === "recipes")
            docs.showRecipes("Recipes availables:");
        if (params.list === "all")
            docs.showStraws("Piscosour utils:", ["internal"], true);
        if (params.list === "all" || params.list === "repoTypes")
            docs.showRepos("Repository Types availables:");
        if (params.list === "all" || params.list === "straws")
            docs.showStraws("Straws availables:", ["normal", "parallel"], true);
        if (params.list === "all" || params.list === "shots")
            docs.showShots("Shots availables:");

        logger.txt("\n");
    },

    showUserCommands: function (title) {
        if (title !== null)
            logger.txt("\n", chalk.bold(title), "\n");

        var enriched = docs.enrichCommands(config.commands);

        config.commands.forEach((command) => {
            var enrich = enriched.search(command);
            if (enrich)
                logger.txt("\t", chalk.bold(command),"(",chalk.yellow(enrich.description),")",enrich.type==='shot'?(" - "+chalk.grey("Shot")):"");
        });
    },

    showCommands: function (title) {

        if (title !== null)
            logger.txt("\n", chalk.bold(title), "\n");

        var enriched = docs.enrichCommands();

        for (var recipeKey in enriched) {
            var recipe = enriched[recipeKey].___recipe;
            if (recipe) {
                logger.txt("\n\t", chalk.cyan.bold("from " + recipe.name + " v." + recipe.version), "\n");
                for (var command in enriched[recipeKey]){
                    if (command!=='___recipe') {
                        var enrich = enriched[recipeKey][command];
                        logger.txt("\t  ", chalk.bold(command), "(", chalk.yellow(enrich.description), ")", enrich.type === 'shot' ? (" - " + chalk.grey("Shot")) : "");
                    }
                }
            }
        }
    },

    enrichCommands: function (commands) {

        var enriched = {
            search : function(command){
                for (var name in this) {
                    if (this[name][command])
                        return this[name][command];
                }
            }
        };
        for (var recipeKey in config.recipes) {
            var recipe = config.recipes[recipeKey];
            if (recipe.name) {
                for (var name in recipe.straws) {
                    var straw = recipe.straws[name];
                    var types = commands?config.repoTypes:docs.getRepoTypes(straw, recipeKey);
                    types.forEach((type) => {
                        var command = type + ":" + name;
                        if (commands?commands.indexOf(command)>=0:(recipe.config.repoTypes.indexOf(type) >= 0 && straw.type === 'normal')) {
                            if (!enriched[recipeKey])
                                enriched[recipeKey] = {___recipe:recipe};

                            enriched[recipeKey][command] = {
                                description: straw.description,
                                type: 'straw'
                            };
                        }
                    });
                }
                for (var name in recipe.shots) {
                    var shot = recipe.shots[name];
                    for (var type in shot) {
                        var command = type + "::" + name;
                        if (commands?commands.indexOf(command)>=0:!(shot.default ? shot.default.isTest : false)) {
                            if (!enriched[recipeKey])
                                enriched[recipeKey] = {___recipe:recipe};

                            enriched[recipeKey][command] = {
                                description: shot[type].description,
                                type: 'shot'
                            };
                        }
                    }
                }
            }
        }
        return enriched;
    },

    showOptions: function (title) {
        logger.txt("", chalk.bold(title), "\n");
        for (var ops in params.knownOpts) {
            logger.txt("\t", chalk.bold("--" + ops), params.info(ops), ": ", docs.cmdOptions[ops]);
        }
    },

    showRecipes: function (title) {
        if (Object.keys(config.recipes).length > 0) {
            logger.txt("\n", chalk.bold(title), "\n");
            var i = 0;
            for (var name in config.recipes) {
                var recipe = config.recipes[name];
                if (recipe.name) {
                    logger.txt("\t", (parseInt(i) + 1), "-", chalk.bold(recipe.name), "(", recipe.version, ")", "-", recipe.description);
                    i++;
                }
            }
        }
    },

    showRepos: function (title) {
        logger.txt("\n", chalk.bold(title), "\n");
        for (var i in config.repoTypes) {
            var repo = config.repoTypes[i];
            logger.txt("\t", (parseInt(i) + 1), "-", chalk.bold(repo), (repo === config.defaultType ? chalk.cyan("(default)") : ""));
        }
    },

    showShots: function (title) {
        logger.txt("\n", chalk.bold(title), "\n");
        var i = 0;
        for (var name in config.shots) {
            if (!config.shots[name].default || !config.shots[name].default.isTest) {
                logger.txt("\t", (parseInt(i) + 1), "-", chalk.bold(name));
                i++;
            }
        }
    },

    showStrawCommands: function (title, strawTypes, recipeKey) {

        var data = config;
        var straws = config.straws;
        if (recipeKey) {
            var tmp = config.recipes[recipeKey];
            data = tmp.config;
            straws = tmp.straws;
        }

        straws = docs.filterStraws(straws, strawTypes);

        if (title !== null)
            logger.txt("\n", chalk.bold(title), "\n");

        for (var name in straws) {
            var straw = straws[name];
            var types = docs.getRepoTypes(straw, recipeKey);
            for (var i in types) {
                if (data.repoTypes.indexOf(types[i]) >= 0) {
                    var msg = ["\t", chalk.bold((types[i] === data.defaultType ? "" : types[i] + ":") + name)];
                    if (straw.options)
                        msg.push("\t", straw.options);
                    msg.push("(", chalk.yellow(straw.description), ")");
                    logger.txt.apply(this, msg);
                }
            }
        }

    },

    /**
     * Check if all shots of a straw has a type implementation
     *
     * @param straw
     * @returns {Array}
     */
    getRepoTypes: function (straw, recipeKey) {
        var data = config;
        var shots = config.shots;

        if (recipeKey) {
            var tmp = config.recipes[recipeKey];
            data = tmp.config;
        }

        var tmp = {};
        for (var i in data.repoTypes) {
            tmp[data.repoTypes[i]] = 0;
        }
        var def = 0;
        var total = 0;
        for (var name in straw.shots) {
            total++;
            var shot = shots[name];

            if (straw.shots[name].type === 'straw')
                total--;

            for (var type in shot) {
                if (type === 'default')
                    def++;
                if (tmp[type] !== undefined)
                    tmp[type]++;
            }
        }

        var res = [];
        for (var type in tmp) {
            if ((tmp[type] + def) === total) {
                res.push(type);
            }
        }
        return res;
    },

    showStraws: function (title, strawTypes, showShots) {
        var straws = docs.filterStraws(config.straws, strawTypes);
        if (Object.keys(straws).length > 0) {
            logger.txt("\n", chalk.bold(title), "\n");
            for (var name in straws) {
                var straw = straws[name];
                logger.txt("\t[", chalk.bold(name), "]", chalk.green(straw.name) + ": (", chalk.yellow(straw.description), ")");
                if (straw.shots && showShots) {
                    logger.txt("\t", chalk.cyan("shots:"), Object.keys(straw.shots).toString(), "\n");
                }
            }
        }
    },

    filterStraws: function (straws, types) {
        var res = {};
        for (var name in straws) {
            var straw = straws[name];
            if (types.indexOf(straw.type) >= 0)
                res[name] = straw;
        }
        return res;
    }
};

module.exports = docs;