var nopt = require("nopt");

var knownOpts = {
        "help" : Boolean,
        "step" : Boolean,
        "version" : Boolean,
        "initStep": [String, null],
        "endStep": [String, null],
        "level" : [ "debug", "verbose", "warning" ]
    },
    shortHands = {
        "i": ["--initStep"],
        "e": ["--endStep"],
        "h" : ["--help"],
        "l" : ["--level"],
        "d" : ["--level","debug"],
        "w" : ["--level","warning"],
        "v" : ["--version"],
        "s" : ["--step"]
    };

var params = nopt(knownOpts, shortHands, process.argv, 2);

params.knownOpts = knownOpts;
params.defaultLang = params.lang = 'en';
if (process.env.LANG)
    params.lang = process.env.LANG.split("_")[0];

params.info = function(opt){
    var ev = knownOpts[opt];
    var res = "";
    if( Object.prototype.toString.call( ev ) === '[object Array]' && typeof ev[0] === 'string') {
        res = "( "+ev+" )";
    }

    res += " [";
    for (var short in shortHands){
        if (shortHands[short][0]==="--"+opt){
            res += " -"+short;
        }
    }
    res += "]";
    return res;
}

module.exports = params;