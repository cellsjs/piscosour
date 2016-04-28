'use strict';

module.exports = {

    run : function(resolve, reject){
        this.logger.info("Updating version of ","#cyan", this.params._pkgName);
        return this.execute("npm",["install","-g",this.params._pkgName]).then(resolve,reject);
    }

};