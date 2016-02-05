var path = require('path');

if (!path.parse)
    path.parse = function(){
        var pathParse = require('path-parse');
        return pathParse.apply(this, arguments);
    };

module.exports = null;