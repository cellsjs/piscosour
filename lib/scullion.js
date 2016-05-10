'use strict';

let fileName = 'piscosour.json';
let path = require('path');
let logger = require('./logger');
let fs = require('fs');
let fsUtils = require('./utils/fsUtils.js');
let pwd = process.cwd();

var serveConfig = function(obj, target, file) {
  if (obj === undefined) {
    obj = {};
  }
  var config = fsUtils.readConfig(file);
  if (!config.empty) {
    logger.trace('reading:', '#green', file);
    obj[target] = config;
  }
  return obj;
};

var serveShots = function(recipe) {

  if (fsUtils.exists(path.join(recipe.dir, 'shots'))) {

    var shotDirs = fs.readdirSync(path.join(recipe.dir, 'shots'));

    if (shotDirs.length > 0) {
      shotDirs.forEach((shotDir) => {
        if (!recipe.shots) {
          recipe.shots = {};
        }
        recipe.shots[shotDir] = serveConfig(recipe.shots[shotDir], 'default', path.join(recipe.dir, 'shots', shotDir, 'params.json'));
        var typeDirs = fs.readdirSync(path.join(recipe.dir, 'shots', shotDir));
        typeDirs.forEach((typeDir) => {
          recipe.shots[shotDir] = serveConfig(recipe.shots[shotDir], typeDir, path.join(recipe.dir, 'shots', shotDir, typeDir, 'params.json'));
        });
      });
    }

  }
  return recipe;
};

var serveStraws = function(recipe) {
  if (fsUtils.exists(path.join(recipe.dir, 'straws'))) {

    var strawDirs = fs.readdirSync(path.join(recipe.dir, 'straws'));

    if (strawDirs.length > 0) {
      strawDirs.forEach((strawDir) => {
        recipe.straws = serveConfig(recipe.straws, strawDir, path.join(recipe.dir, 'straws', strawDir, 'straw.json'));
      });
    }
  }
  return recipe;
};

var cook = function(recipes) {
  logger.trace('#magenta', 'Scullion is cooking all recipes');
  Object.getOwnPropertyNames(recipes).forEach((name) => {
    var recipe = recipes[name];
    logger.trace('cooking:', '#green', recipe.name ? recipe.name : name, 'dir:', recipe.dir);

    recipe = serveConfig(recipe, 'config', path.join(recipe.dir, fileName));

    if (recipe.name) {
      recipe = serveShots(recipe);
      recipe = serveStraws(recipe);
    }
  });

  return {
    recipes: recipes,
    rootDir: pwd
  };
};

/**
 * **Internal:**
 *
 * Prepare the config object to be use by the config module.
 *
 * @returns {{recipes, rootDir}}
 * @module scullion
 */
module.exports = {cook: cook};