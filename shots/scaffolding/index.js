'use strict';

let fs = require('fs');

/**
 * Create a recipe using a yeoman generator. This shot execute yeoman and generate a new recipe using the user introduced parameters.
 */
module.exports = {

  run: function(resolve, reject) {
    this.logger.info('#magenta', 'run', 'Create new recipe from template');
    this.fsCreateDir(this.params.recipeName);
    process.chdir(this.params.recipeName);
    return this.execute('yo', this.promptArgs([ 'pisco-recipe' ])).then(resolve, reject);
  }
};