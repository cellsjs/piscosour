'use strict';

const inquirer = require('inquirer');

module.exports = {
  check: function() {
    if (this.params.prompts && !this.params.disablePrompts) {
      return this.inquire('prompts');
    }
  },

  addons: {

    inquire: function(name) {
      const prompts = this.params[name];

      const getValidate = function(prompt) {
        return function(userInput) {
          return userInput ? true : '"' + prompt.name + '" is required. ' + prompt.message;
        };
      };

      const stepResolution = ((prompt, attr) => {
        if (prompt[attr] !== undefined
          && Object.prototype.toString.call(prompt[attr]) !== '[object Function]'
          && typeof prompt[attr] !== 'boolean'
          && prompt[attr].indexOf('#') === 0) {
          let functionName = prompt[attr].replace('#', '');
          if (functionName.indexOf('(') >= 0) {
            functionName = functionName.replace('()', '');
          }
          const func = this[functionName];
          if (func) {
            prompt[attr] = func;
          } else {
            prompt[attr] = undefined;
            this.logger.info('#yellow', 'WARNING', 'value', functionName, 'doesn\'t exist in this step!!!');
          }
        }
      });

      const reqs = [];

      if (prompts) {
        prompts.forEach((prompt) => {

          ['when', 'validate', 'choices', 'filter', 'type', 'default', 'message'].forEach((method) => stepResolution(prompt, method));

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
      if (reqs.length > 0) {
        return inquirer.prompt(reqs).then((answers) => {
          reqs.forEach((req) => {
            if (answers[req.name]) {
              this.params[req.name] = answers[req.name];
            }
          });
        });
      } else {
        return Promise.resolve();
      }
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
