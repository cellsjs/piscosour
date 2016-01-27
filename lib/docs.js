/*jshint node:true */

'use strict';

var params = require('./params'),
    logger = require('./logger'),
    i18n = require('./i18n'),
    config = require('./config'),
    path = require('path'),
    fs = require('fs'),
    pkg = require(path.join(config.modulesDir.module,'package.json')),
    chalk = require('chalk');

var messages = i18n.messages("/help/help.json");
var initMessage = i18n.readFile('/help/init.txt');

var docs = {

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
        //logger.txt(initMessage);
        if (isShot){
            logger.txt("\n ",messages["shotTitle"],chalk.bold(args+":"),"\n");
            logger.txt(i18n.readFile('/shots/'+args+'/info.md'),"\n");
        }else{
            var strawObj = config.straws[args];
            logger.txt("\n ",chalk.bold(strawObj.name+":"),"[",args[0],"]","(",strawObj.description,")");
            logger.txt(i18n.readFile('/straws/'+args+'/info.md'));
            logger.txt("",chalk.bold.underline(messages["shots"]),"\n");
            var shots = [];
            for (var shot in config.straws[args].shots){
                logger.txt(" ",chalk.cyan.bold(shot+":"),"\n");
                logger.txt(i18n.readFile('/shots/'+shot+'/info.md'),"\n");
            }

        }
    },

    /**
     * Return all the straws/shots available for the project.
     * read first the local lifecycles file
     */
    index : function() {
        logger.trace("#green","docs:index");
        logger.txt(initMessage);
        logger.txt("\n",chalk.bold(messages["name"])+":",pkg.name, pkg.version, " - ", pkg.description);
        logger.txt("",chalk.bold(messages["usageTitle"])+":",messages["usage"]);
        logger.txt("",chalk.bold(messages["options"])+":","\n");
        for (var ops in params.knownOpts){
            logger.txt("\t",chalk.bold("--"+ops),params.info(ops),": ",messages[ops]);
        }

        logger.txt("\n",chalk.bold(messages["utils"]),"\n");
        docs.showStraws(docs.filterStraws(config.straws,["internal"]),false);

        logger.txt("\n",chalk.bold(messages["repoTypes"]),"\n");
        for (var i in config.repoTypes){
            logger.txt("\t",(parseInt(i)+1),"-",chalk.bold(config.repoTypes[i]),":");
        }

        logger.txt("\n",chalk.bold(messages["straws"]),"\n");
        docs.showStraws(docs.filterStraws(config.straws,["normal","parallel"]),false);
        logger.txt("\n");
    },

    filterStraws : function(straws,types){
        var res = {};
        for (var name in straws){
            var straw = straws[name];
            if (types.indexOf(straw.type)>=0)
                res[name] = straw;
        }
        return res;
    },

    showStraws : function (straws, showShots){
        for (var name in straws){
            var straw = straws[name];
            logger.txt("\t[", chalk.bold(name), "]", chalk.green(straw.name) + ": (", chalk.yellow(straw.description), ")");
            if (straw.shots && showShots)
                logger.txt("\t\t", chalk.cyan(messages["shots"]), Object.keys(straw.shots), "\n");
        }
    }

};

module.exports = docs;