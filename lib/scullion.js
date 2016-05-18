'use strict';

const fileName = 'piscosour.json';
const path = require('path');
const logger = require('./logger');
const fs = require('fs');
const fsUtils = require('./utils/fsUtils.js');
const pwd = process.cwd();

const serveConfig = function(obj, target, file) {
  if (obj === undefined) {
    obj = {};
  }
  const config = fsUtils.readConfig(file);
  if (!config.empty) {
    logger.trace('reading:', '#green', file);
    obj[target] = config;
  }
  return obj;
};

const serveShots = function(recipe) {

  if (fsUtils.exists(path.join(recipe.dir, 'shots'))) {

    const shotDirs = fs.readdirSync(path.join(recipe.dir, 'shots'));

    if (shotDirs.length > 0) {
      shotDirs.forEach((shotDir) => {
        if (!recipe.shots) {
          recipe.shots = {};
        }
        recipe.shots[shotDir] = serveConfig(recipe.shots[shotDir], 'default', path.join(recipe.dir, 'shots', shotDir, 'params.json'));
        const typeDirs = fs.readdirSync(path.join(recipe.dir, 'shots', shotDir));
        typeDirs.forEach((typeDir) => {
          recipe.shots[shotDir] = serveConfig(recipe.shots[shotDir], typeDir, path.join(recipe.dir, 'shots', shotDir, typeDir, 'params.json'));
        });
      });
    }

  }
  return recipe;
};

const serveStraws = function(recipe) {
  if (fsUtils.exists(path.join(recipe.dir, 'straws'))) {

    const strawDirs = fs.readdirSync(path.join(recipe.dir, 'straws'));

    if (strawDirs.length > 0) {
      strawDirs.forEach((strawDir) => {
        recipe.straws = serveConfig(recipe.straws, strawDir, path.join(recipe.dir, 'straws', strawDir, 'straw.json'));
      });
    }
  }
  return recipe;
};

const cook = function(recipes) {
  logger.trace('#magenta', 'Scullion is cooking all recipes');
  Object.getOwnPropertyNames(recipes).forEach((name) => {
    let recipe = recipes[name];
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