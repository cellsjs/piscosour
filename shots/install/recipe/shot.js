'use strict';

var piscosour = require('../../..'),
    fs = require('fs'),
    path = require('path'),
    Shot = piscosour.Shot,
    params = piscosour.params,
    config = piscosour.config,
    logger = piscosour.logger;

var shot = new Shot({
    description : "Install npm recipe inside this executable",

    check : function(resolve){
        logger.info("#magenta","check","Check all pre-requisites for the execution");
        resolve();
    },

    config : function(resolve){
        logger.info("#magenta","config","All configurations labors");
        resolve();
    },

    run : function(resolve, reject){
        logger.info("#magenta","run","Installing recipe");

        process.chdir(config.modulesDir.module);

        var name = params.recipeName;

        if (name.indexOf('https://')>=0) {
            name = path.parse(params.recipeName).name;
            params.recipeName = "git+" + params.recipeName;
        }

        if (fs.existsSync(path.join(config.modulesDir.module,'node_modules',name))) {
            logger.info("#green",name," is already installed in piscosour!!");
            if (params.reinstall) {
                logger.info("reinstalling","#cyan",name);
                //TODO: Para evitar problemas en windows quizá sea mejor meter el borrar con tareas node (rimraf, p.e.).
                shot.executeSync("rm",["-rf",path.join(config.modulesDir.module,'node_modules',name)], reject, true);
                shot.executeSync("npm",["install",params.recipeName], reject, true);
                resolve();
            }else{
                resolve();
            }
        }else{
            shot.execute("npm",["install",params.recipeName],resolve, reject);
        }
        var updated = shot.runner.updateRecipes(name);
    },

    /**
     * Mantiene un fichero llamado recipes.json con las recetas que han sido instaladas correctamente dentro de una
     * distribución de piscosour
     *
     * @param name
     * @returns {boolean}
     */
    updateRecipes : function(name) {
        var recipes = {};

        var filename = 'recipes.json';
        var file = path.join(config.modulesDir.module, filename);

        if (fs.existsSync(file))
            recipes = JSON.parse(fs.readFileSync(file));

        if (!recipes.list)
            recipes.list = [];

        if (recipes.list.indexOf(name)>=0)
            return false;
        else {
            recipes.list.push(name);
            fs.writeFileSync(filename,JSON.stringify(recipes));
            return true;
        }
    },

    prove : function(resolve){
        logger.info("#magenta","prove","Prove that the run execution was ok");
        resolve();
    },

    notify : function(resolve){
        logger.info("#magenta","notify","Recollect all execution information and notify");
        resolve();
    }
});

module.exports = shot;