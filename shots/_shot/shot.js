'use strict';

var piscosour = require('../../../index'),
    Shot = piscosour.Shot,
    logger = piscosour.logger;


module.exports = new Shot({
    description : "small description",

    // all stage implementation
    pre : function(resolve){
        resolve();
    },

    run : function(resolve){
        resolve();
    },

    post : function(resolve){
        resolve();
    }

});