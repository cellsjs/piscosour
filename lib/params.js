var nopt = require("nopt"),
    inquirer = require("inquirer");

var knownOpts = {
        "help" : Boolean,
        "shot" : Boolean,
        "version" : Boolean,
        "initShot": [String, null],
        "endShot": [String, null],
        "level" : [ "debug", "verbose", "warning" ]
    },
    shortHands = {
        "i": ["--initShot"],
        "e": ["--endShot"],
        "h" : ["--help"],
        "l" : ["--level"],
        "d" : ["--level","debug"],
        "w" : ["--level","warning"],
        "v" : ["--version"],
        "s" : ["--shot"]
    };

var params = nopt(knownOpts, shortHands, process.argv, 2);

params.inquire = function(prompts,resolve){

    var reqs = [];

    for (var i in prompts){
        if (!params[prompts[i].name]){
            reqs.push(prompts[i].name)
        }
    }

    if (reqs.length>0) {
        inquirer.prompt(prompts, function (answers) {
            for (var i in reqs){
                params[reqs[i]] = answers[reqs[i]];
            }
            resolve();
        });
    }else
        resolve();
};

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