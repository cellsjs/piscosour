'use strict';

var path = require('path'),
    context = require('../../lib/context');

module.exports = {
    description : "Get automatic context of execution",

    check : function(){
        var mustBe = this.params.mustBeIn;
        if (mustBe){
            var ami = this.ctxWhoami();
            mustBe.forEach((mustType) => {
                if (ami.indexOf(mustType)<0)
                    throw {error: "This is not the root of a "+mustType};
            });

            this.logger.info("This shot is in the root of a "+ami,"#green","OK");
        }
    },

    addons : {
        ctxIs : function(name){
            return context.cis(name,this.params.workingDir);
        },
        ctxWhoami : function(){
            return context.whoami(this.params.workingDir);
        }
    }
};