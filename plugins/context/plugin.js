'use strict';

var path = require('path');

module.exports = {
    description : "Get automatic context of execution",

    check : function(){
        this.logger.info("is component?",this.ctxIs('component'));
    },

    addons : {
        _inRoot : function(fileName){
            fileName = fileName.replace('/',path.sep);
            fileName = path.join(this.config.rootDir,fileName);
            return this.fsExists(fileName)?fileName:null;
        },
        ctxIs : function(name){
            let ctx = this.params.contexts[name];

            if (!ctx) return false;

            for (let n in ctx){
                let check = ctx[n];
                this.logger.trace("check file:","#cyan",check.file);

                let file = this._inRoot(check.file);

                if (!file && !check.sufficient)
                    return false;

                if (check.conditions && file){
                    let that = this.fsReadConfig(file);

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
    }
};