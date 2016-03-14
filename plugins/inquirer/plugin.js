'use strict';

var piscosour = require('../..'),
    inquirer = require('inquirer'),
    Plugin = piscosour.Plugin;

var plug = new Plugin({
    description : "Plugin inquirer",

    check : function(shot, resolve, reject){
        if (shot.runner && shot.runner.params.prompts)
            shot.inquire("prompts").then(resolve, reject);
    },

    addons : {

        inquire: function (name) {
            var prompts = this.runner.params[name];

            var getValidate = function (prompt) {
                return function (userInput) {
                    return userInput ? true : '"' + prompt.name + '" is required. ' + prompt.message;
                };
            };

            var shotResolution = function (prompt, attr) {
                if (prompt[attr] !== undefined && Object.prototype.toString.call(prompt[attr]) !== '[object Function]' && prompt[attr].indexOf("#") === 0) {
                    var functionName = prompt[attr].replace('#', '');
                    var func = this.runner[functionName];
                    if (func)
                        prompt[attr] = func;
                    else {
                        prompt[attr] = undefined;
                        logger.info("#yellow", "WARNING", "value", functionName, "doesn't exists!! in this shot");
                    }
                }
            }.bind(this);

            var reqs = [];

            for (var i in prompts) {
                var prompt = prompts[i];

                shotResolution(prompt, "when");
                shotResolution(prompt, "validate");
                shotResolution(prompt, "choices");

                if (prompt.required && !prompt.validate)
                    prompt.validate = getValidate(prompt);

                if (prompt.env !== undefined && process.env[prompt.env])
                    this.runner.params[prompt.name] = process.env[prompt.env];

                if (prompt.value !== undefined && !this.runner.params[prompt.name])
                    this.runner.params[prompt.name] = prompt.value;

                if (this.runner.params[prompt.name] === undefined) {
                    reqs.push(prompt)
                }
            }

            var promise = new Promise(function (resolve, reject) {
                if (reqs.length > 0) {
                    inquirer.prompt(reqs, function (answers) {
                        for (var i in reqs) {
                            this.runner.params[reqs[i].name] = answers[reqs[i].name];
                        }
                        resolve();
                    }.bind(this));
                } else
                    resolve();
            }.bind(this));
            return promise;
        }
    }
});

module.exports = plug;