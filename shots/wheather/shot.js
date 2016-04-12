'use strict';

module.exports = {
    run : function(resolve, reject){
        this.logger.info("#magenta","run","The wheather in ","#green",this.params.yourCity,"is:");
        this.sh("curl http://wttr.in/"+this.params.yourCity, null, true);
    }
};