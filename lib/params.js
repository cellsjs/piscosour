var nopt = require("nopt");

var knownOpts = {
        "help" : Boolean,
        "junitReport" : Boolean,
        "shot" : Boolean,
        "commands" : ["all"],
        "list" : ["all","recipes","straws","shots","repoTypes"],
        "version" : Boolean,
        "initShot": [String, null],
        "endShot": [String, null],
        "level" : [ "debug", "verbose", "warning" ]
    },
    shortHands = {
        "u": ["--junitReport"],
        "i": ["--initShot"],
        "e": ["--endShot"],
        "h" : ["--help"],
        "a" : ["--commands","all"],
        "la" : ["--list","all"],
        "lr" : ["--list","recipes"],
        "lst" : ["--list","straws"],
        "lsh" : ["--list","shots"],
        "lt" : ["--list","repoTypes"],
        "l" : ["--level"],
        "d" : ["--level","debug"],
        "w" : ["--level","warning"],
        "v" : ["--version"],
        "s" : ["--shot"]
    };

var defaultString = function(knownOpts){
    for (var i in process.argv){
        var option = process.argv[i];
        if (option.indexOf("--")>=0){
            knownOpts[option.replace('--','')] = [String, null];
        }
    }
    return knownOpts;
};

knownOpts = defaultString(knownOpts)
var params = nopt(knownOpts, shortHands, process.argv, 2);

params.options = JSON.parse(JSON.stringify(params));
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
};

module.exports = params;