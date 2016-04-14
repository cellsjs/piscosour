'use strict';

var path = require('path'),
    config = require('./config'),
    logger = require('./logger'),
    fsUtil = require('./utils/fsUtils');

var context = {

    _inRoot : function(fileName){
        fileName = fileName.replace('/',path.sep);
        fileName = path.join(config.rootDir,fileName);
        return fsUtil.exists(fileName)?fileName:undefined;
    },
    cis : function(name){
        let ctx = config.params.contexts[name];

        if (!ctx) return false;

        for (let n in ctx){
            let check = ctx[n];
            logger.trace("check file:","#cyan",check.file);

            let file = context._inRoot(check.file);

            if (check.noexists?file:!file && !check.sufficient)
                return false;

            if (check.conditions && file){
                let that = fsUtil.readConfig(file);

                for (let i in check.conditions){
                    let res = eval(check.conditions[i],that);
                    if (res && check.sufficient)
                        return true;
                    else if (!res && !check.sufficient)
                        return false;
                }
            }
        };

        return true;
    }
};

module.exports = context;