'use strict';

var piscosour = require('../../../index'),
    Shot = piscosour.Shot,
    gulp = require('gulp'),
    logger = piscosour.logger;

gulp.task('prueba', function(cb) {
    console.log("ejecuto un gulp");
    cb();
});

var shot = new Shot({
    description : "Checking System Dependencies for app creation",

    // all stage implementation
    pre : function(resolve, reject){
        shot.execute("ls",["-las"], resolve, reject);

        logger.info("Getting all system dependencies...","#green","OK");
    },

    run : function(resolve,reject){
        shot.runGulp("prueba", resolve, reject);

        logger.info("Solving system dependencies...","#green","OK");
    },

    post : function(resolve){
        logger.info("Checking all system dependencies...","#green","OK");
        resolve();
    }

});

module.exports = shot;