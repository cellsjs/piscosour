'use strict';

var piscosour = require('../../..'),
    fs = require('fs'),
    path = require('path'),
    Shot = piscosour.Shot,
    config = piscosour.config;

var shot = new Shot({
    description : "Install npm recipe inside this executable",

    check : function(resolve){
        shot.logger.info("#magenta","check","Check all pre-requisites for the execution");
    },

    config : function(resolve){
        shot.logger.info("#magenta","config","All configurations labors");
    },

    run : function(resolve, reject){
        shot.logger.info("#magenta","run","Installing recipe");

        process.chdir(config.modulesDir.module);

        var name = shot.runner.params.recipeName;

        if (name.indexOf('https://')>=0) {
            name = path.parse(shot.runner.params.recipeName).name;
            shot.runner.params.recipeName = "git+" + shot.runner.params.recipeName;
        }

        if (fs.existsSync(path.join(config.modulesDir.module,'node_modules',name))) {
            shot.logger.info("#green",name," is already installed in piscosour!!");
            if (shot.runner.params.reinstall) {
                shot.logger.info("reinstalling","#cyan",name);
                //TODO: Para evitar problemas en windows quizá sea mejor meter el borrar con tareas node (rimraf, p.e.).
                shot.executeSync("rm",["-rf",path.join(config.modulesDir.module,'node_modules',name)], reject, true);
                shot.executeSync("npm",["install",shot.runner.params.recipeName], reject, true);
            }
        }else{
            return shot.execute("npm",["install",shot.runner.params.recipeName],resolve, reject);
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
            fs.writeFileSync(filename,JSON.stringify(recipes,null,4));
            return true;
        }
    },

    prove : function(resolve){
        shot.logger.info("#magenta","prove","Prove that the run execution was ok");
    },

    notify : function(resolve){
        shot.logger.info("#magenta","notify","Recollect all execution information and notify");
    }
});

module.exports = shot;