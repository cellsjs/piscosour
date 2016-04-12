'use strict';

module.exports = {
    run : function(resolve, reject){
        this.logger.info("#magenta","run","Weather in ","#green",this.params.yourCity);
        this.sh("curl http://wttr.in/"+this.params.yourCity, null, true);
    }
};