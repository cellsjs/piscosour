'use strict';

var piscosour = require('piscosour'),
    Shot = piscosour.Sour;


module.exports = new Shot({
    name : "ejemplo",

    pre : function(){
        logger.info("pre---------->");
    },

    run : function(){

    }

});