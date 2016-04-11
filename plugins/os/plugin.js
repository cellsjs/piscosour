'use strict';

module.exports = {
    description : "OS plugin",

    addons : {
        isWin: function () {
            return process.env.OS && process.env.OS.indexOf('Windows')>=0;
        },
        isMac : function() {
            return process.env._system_name && process.env._system_name==='OSX';
        }
    }
};