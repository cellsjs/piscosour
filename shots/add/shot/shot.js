'use strict';

var Shot = require('../../../lib/shot'),
    logger = require('../../../lib/slife-logger');

module.exports = new Shot({
    name : "ejemplo",

    pre : function(){
        logger.info("pre---------->");
    }
});