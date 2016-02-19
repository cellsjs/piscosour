/*jshint node:true */

'use strict';

var params = require('./params'),
    logger = require('./logger'),
    config = require('./config'),
    path = require('path'),
    fs = require('fs'),
    pkg = require(path.join(config.modulesDir.module,'package.json')),
    chalk = require('chalk');

var docs = {

    cmdOptions : {
        "junitReport" : "write junit report at the end",
        "initShot": "from shot : "+config.cmd+" -i <shotname>",
        "endShot": "to shot : "+config.cmd+" -e <shotname>",
        "help" : "shows detailed info for command, <name> of straw or -s <shot> name shot : "+config.cmd+" -h <strawname>",
        "all" : "show all piscosour core commands",
        "commands" : "list prepared commands of piscosour",
        "list" : "list piscosour elements",
        "level" : "debug level of output : "+config.cmd+" -l verbose",
        "shot" : "execute only one shot : "+config.cmd+" -s <shotname>",
        "version" : "show version"
    },

    /**
     * returns help text
     * @param name, name of the help file
     * @param locale
     */
    help : function(isShot, args){
        logger.trace("#green","docs:help","params:",args);
        if (args && args.length===0){
            docs.index();
        }else{
            docs.info(isShot,args);
        }
    },

    /**
     * Show information for any particular shot or straw
     * @param isShot
     * @param args (name of the shot/straw)
     */
    info : function(isShot, args){
        logger.trace("#green","docs:info","isShot:",isShot,"name:",args);
        if (isShot){
            logger.txt("\n ","Shot",chalk.bold(args+":"),"\n");
            //logger.txt(i18n.readFile('/shots/'+args+'/info.md'),"\n");
        }else{
            var strawObj = config.straws[args];
            logger.txt("\n ",chalk.bold(strawObj.name+":"),"[",args[0],"]","(",strawObj.description,")");
            //logger.txt(i18n.readFile('/straws/'+args+'/info.md'));
            logger.txt("",chalk.bold.underline("shots"),"\n");
            var shots = [];
            for (var shot in config.straws[args].shots){
                logger.txt(" ",chalk.cyan.bold(shot+":"),"\n");
                //logger.txt(i18n.readFile('/shots/'+shot+'/info.md'),"\n");
            }

        }
    },

    /**
     * Return all the straws/shots available for the project.
     * read first the local lifecycles file
     */
    index : function() {
        logger.trace("#green","docs:index");
        logger.txt("\n",chalk.bold("Name")+":",pkg.name, pkg.version, " - ", pkg.description);
        logger.txt("",chalk.bold("Usage")+":",config.cmd,"[Command] [Options...]");

        docs.showStrawCommands("Commands:",[config.defaultType],["normal", "parallel", "internal"]);
        logger.txt("");
        docs.showOptions("Options:");

        if (params.list==="all" || params.list==="recipes")
            docs.showRecipes("Recipes imported:");
        if (params.list==="all")
            docs.showStraws("Piscosour utils:", ["internal"], true);
        if (params.list==="all" || params.list==="repoTypes")
            docs.showRepos("Repository Types availables:");
        if (params.list==="all" || params.list==="straws")
            docs.showStraws("Straws availables:", ["normal", "parallel"], true);
        if (params.list==="all" || params.list==="shots")
            docs.showShots("Shots availables:");

        logger.txt("\n");
    },

    showOptions : function(title){
        logger.txt("",chalk.bold(title),"\n");
        for (var ops in params.knownOpts){
            logger.txt("\t",chalk.bold("--"+ops),params.info(ops),": ",docs.cmdOptions[ops]);
        }
    },

    showRecipes : function(title){
        if (config.recipes.length>0){
            logger.txt("\n",chalk.bold(title),"\n");
            for (var i in config.recipes){
                var recipe = config.recipes[i];
                logger.txt("\t",(parseInt(i)+1),"-",chalk.bold(recipe.name),"(",recipe.version,")","-",recipe.description);
            }
        }
    },

    showRepos : function(title){
        logger.txt("\n",chalk.bold(title),"\n");
        for (var i in config.repoTypes){
            var repo = config.repoTypes[i];
            logger.txt("\t",(parseInt(i)+1),"-",chalk.bold(repo),(repo===config.defaultType?chalk.cyan("(default)"):""));
        }
    },

    showShots : function(title){
        logger.txt("\n",chalk.bold(title),"\n");
        var i = 0;
        for (var name in config.shots){
            if (!config.shots[name].isTest) {
                logger.txt("\t", (parseInt(i) + 1), "-", chalk.bold(name));
                i++;
            }
        }
    },

    showStrawCommands : function(title, repoTypes, strawTypes){
        logger.txt("\n",chalk.bold(title),"\n");
        var straws = docs.filterStraws(config.straws,strawTypes);
        for (var name in straws){
            var straw = straws[name];
            var types = docs.getRepoTypes(straw);
            for (var i in types){
                if (repoTypes.indexOf(types[i])>=0)
                    logger.txt("\t", chalk.bold((types[i]===config.defaultType?"":types[i]+":")+name), "(", chalk.yellow(straw.description), ")");
            }
        }
    },

    //TODO: refactorización de config, hacer esto directamente ahí.
    getRepoTypes : function(straw){
        var tmp = {};
        for (var i in config.repoTypes){
            tmp[config.repoTypes[i]] = 0;
        }
        var total = 0;
        for (var name in straw.shots){
            total++;
            var shot = straw.shots[name];
            for (var type in shot){
                if (type==="type")
                    total--;
                if (tmp[type]!==undefined) {
                    tmp[type]++;
                }
            }
        }
        var res = [];
        for (var type in tmp){
            if (tmp[type]===total)
                res.push(type);
        }
        return res;
    },

    showShotCommands : function(title){
        logger.txt("\n",chalk.bold(title),"\n");
    },


    showStraws : function ( title, strawTypes, showShots){
        logger.txt("\n",chalk.bold(title),"\n");
        var straws = docs.filterStraws(config.straws,strawTypes);
        for (var name in straws){
            var straw = straws[name];
            logger.txt("\t[", chalk.bold(name), "]", chalk.green(straw.name) + ": (", chalk.yellow(straw.description), ")");
            if (straw.shots && showShots) {
                logger.txt("\t", chalk.cyan("shots:"), Object.keys(straw.shots).toString(), "\n");
            }
        }
    },

    filterStraws : function(straws,types){
        var res = {};
        for (var name in straws){
            var straw = straws[name];
            if (types.indexOf(straw.type)>=0)
                res[name] = straw;
        }
        return res;
    }

};

module.exports = docs;