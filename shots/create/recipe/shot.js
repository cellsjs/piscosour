'use strict';

var Shot = require('../../../index').Shot,
    logger = require('../../../lib/logger');

module.exports = new Shot({
    name : "ejemplo",

    pre : function(){
        logger.info("pre---------->");
    }
});