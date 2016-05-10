'use strict';

var inquirer = require('inquirer');

module.exports = {
  description: 'Plugin inquirer',

  check: function() {
    if (this.params.prompts) {
      return this.inquire('prompts');
    }
  },

  addons: {

    inquire: function(name) {
      var prompts = this.params[name];

      var getValidate = function(prompt) {
        return function(userInput) {
          return userInput ? true : '"' + prompt.name + '" is required. ' + prompt.message;
        };
      };

      var shotResolution = function(prompt, attr) {
        if (prompt[attr] !== undefined && Object.prototype.toString.call(prompt[attr]) !== '[object Function]' && typeof prompt[attr] !== 'boolean' && prompt[attr].indexOf('#') === 0) {
          var functionName = prompt[attr].replace('#', '');
          var func = this.runner[functionName];
          if (func) {
            prompt[attr] = func;
          } else {
            prompt[attr] = undefined;
            this.logger.info('#yellow', 'WARNING', 'value', functionName, 'doesn\'t exists!! in this shot');
          }
        }
      }.bind(this);

      var reqs = [];

      if (prompts) {
        prompts.forEach((prompt) => {

          shotResolution(prompt, 'when');
          shotResolution(prompt, 'validate');
          shotResolution(prompt, 'choices');
          shotResolution(prompt, 'default');

          if (prompt.required && !prompt.validate) {
            prompt.validate = getValidate(prompt);
          }

          if (prompt.env !== undefined && process.env[prompt.env]) {
            this.params[prompt.name] = process.env[prompt.env];
          }

          if (prompt.value !== undefined && !this.params[prompt.name]) {
            this.params[prompt.name] = prompt.value;
          }

          if (this.params[prompt.name] === undefined) {
            reqs.push(prompt);
          }
        });
      }

      return new Promise((resolve, reject) => {
        if (reqs.length > 0) {
          inquirer.prompt(reqs, (answers) => {
            reqs.forEach((req) => {
              this.params[req.name] = answers[req.name];
            });
            resolve(answers);
          });
        } else {
          resolve();
        }
      });
    },

    promptArgs: function(array) {
      if (this.params.prompts) {
        this.params.prompts.forEach((prompt) => {
          array.push('--' + prompt.name);
          array.push(this.params[prompt.name]);
        });
      }
      return array;
    }
  }
};