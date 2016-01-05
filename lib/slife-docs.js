/*jshint node:true */

'use strict';

var params = require('./slife-params'),
    logger = require('./slife-logger'),
    i18n = require('./slife-i18n'),
    config = require('./slife-config'),
    fs = require('fs'),
    pkg = require(config.modulesDir.module+'/package.json'),
    chalk = require('chalk');

var messages = i18n.messages("/help/help.json");
var initMessage = i18n.readFile('/help/init.txt');

var docs = {

    /**
     * returns help text
     * @param name, name of the help file
     * @param locale
     */
    help : function(isStep, args){
        logger.trace("#green","slife-docs:help","params:",args);
        if (args && args.length===0){
            docs.index();
        }else{
            docs.info(isStep,args);
        }
    },

    /**
     * Show information for any particular step or pipeline
     * @param isStep
     * @param args (name of the step/pipeline)
     */
    info : function(isStep, args){
        logger.trace("#green","slife-docs:info","isStep:",isStep,"name:",args);
        //logger.txt(initMessage);
        if (isStep){
            logger.txt("\n ",messages["stepTitle"],chalk.bold(args+":"),"\n");
            logger.txt(i18n.readFile('/steps/'+args+'/info.md'),"\n");
        }else{
            var pipelineObj = config.pipelines[args];
            logger.txt("\n ",chalk.bold(pipelineObj.name+":"),"[",args[0],"]","(",pipelineObj.description,")");
            logger.txt(i18n.readFile('/pipelines/'+args+'/info.md'));
            logger.txt("",chalk.bold.underline(messages["steps"]),"\n");
            var steps = [];
            for (var step in config.pipelines[args].steps){
                logger.txt(" ",chalk.cyan.bold(step+":"),"\n");
                logger.txt(i18n.readFile('/steps/'+step+'/info.md'),"\n");
            }

        }
    },

    /**
     * Return all the pipelines/steps available for the project.
     * read first the local lifecycles file
     */
    index : function() {
        logger.trace("#green","slife-docs:index");
        logger.txt(initMessage);
        logger.txt("\n",chalk.bold(messages["name"])+":",pkg.name, pkg.version, " - ", pkg.description);
        logger.txt("",chalk.bold(messages["usageTitle"])+":",messages["usage"]);
        logger.txt("",chalk.bold(messages["options"])+":","\n");
        for (var ops in params.knownOpts){
            logger.txt("\t",chalk.bold("--"+ops),params.info(ops),": ",messages[ops]);
        }
        logger.txt("\n",chalk.bold(messages["pipelines"]),"\n");
        for (var pipeline in config.pipelines){
            var pipelineObj = config.pipelines[pipeline];
            logger.txt("\t[",chalk.bold(pipeline),"]",chalk.green(pipelineObj.name)+": (",chalk.yellow(pipelineObj.description),")");
            logger.txt("\t\t",chalk.cyan(messages["steps"]),Object.keys(config.pipelines[pipeline].steps),"\n");
        }
        logger.txt("\n");
    }

};

module.exports = docs;