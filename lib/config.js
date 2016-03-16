/*jshint node:true */

'use strict';

var chalk = require('chalk'),
    path = require('path'),
    fs = require('fs'),
    fsUtils = require('./utils/fsUtils'),
    logger = require('./logger'),
    Shot = require('./shot'),
    cmdParams = require('./params'),
    chef = require('./chef'),
    scullion = require('./scullion');

/**
 *
 * @constructor Config
 */
var Config = function() {

    var config;
    var mergedConfig;

    /**
     * Merge two object. Added allways win. Thats means that in case of colision added is keeped.
     *
     * @param orig: Origin object
     * @param added: Object to be added, winning!
     * @returns {*} Object merged
     */
    var _mergeObject = function(orig, added){
        logger.silly("#green","config:_mergeObject");
        if (orig===undefined) orig = {};
        if (added===undefined) added = {};
        else added = JSON.parse(JSON.stringify(added));
        for (var name in orig) {
            if (added[name] && Object.prototype.toString.call( added[name] ) === '[object Object]') {
                added[name] = _mergeObject(orig[name], added[name]);
            }else if (added[name] && Object.prototype.toString.call( added[name] ) === '[object Array]') {
                for (var i in orig[name]) {
                    if (added[name].indexOf(orig[name][i])<0 && Object.prototype.toString.call(orig[name][i]) !== '[object Object]')
                        added[name].push(orig[name][i]);
                }
            }else {
                if (!added[name]) {
                    added[name] = orig[name];
                }
            }
        }
        return added;
    };

    var _mergeConfig = function(recipes){
        logger.silly("#green","config:_mergeConfig");
        var mergedConfig = {}

        for (var name in recipes){
            var recipe = recipes[name];
            if (recipe.name && name!=='module') {
                mergedConfig = _mergeUnit(mergedConfig,recipes,name);
            }
        }

        mergedConfig = _mergeUnit(mergedConfig,recipes,'module');
        mergedConfig = _mergeUnit(mergedConfig,recipes,'configLocal');

        return mergedConfig;
    };

    var _mergeUnit = function(config,recipes,name){
        config = _mergeObject(config,recipes[name].config);
        config.shots = _mergeObject(config.shots,recipes[name].shots);
        config.straws = _mergeObject(config.straws,recipes[name].straws);

        if (recipes[name].config && recipes[name].config.straws){
            logger.warn("#yellow","DEPRECATED STRAWS DEFINITION IN "+recipes[name].name+" RECIPE:","define straws only in straw.json not in piscosour.json!!");
            config.straws = _mergeObject(config.straws,recipes[name].config.straws);
        }

        return config;
    };

    var _getGen = function(normal,type){
        logger.silly("#green","config:_getGen -in-",normal, type);
        var obj;
        if (normal.recipe) {
            obj = config.recipes[normal.recipe][type][normal.name];
        } else {
            obj = mergedConfig[type][normal.name];
        }
        logger.silly("#green","config:_getGen -out-", obj);
        return obj;
    };

    var _precededParams = function(params){
        if (mergedConfig.params)
            params = _mergeObject(params,mergedConfig.params);

        if (config.recipes.configLocal && config.recipes.configLocal.config && config.recipes.configLocal.config.params)
            params = _mergeObject(params,config.recipes.configLocal.config.params);
        return params;
    };

    var _normalShot = function(normal){
        var normalCopy = JSON.parse(JSON.stringify(normal));
        normalCopy.origName = normal.name;
        normalCopy.name=normal.name.indexOf(':')>=0?normal.name.split(':')[0]:normal.name;
        return normalCopy;
    };

    // ----------------

    config = scullion.cook(chef.getRecipes());
    logger.trace("Scullion ends","#green","Config is cooked:",JSON.stringify(config));

    mergedConfig = _mergeConfig(config.recipes);
    logger.debug("Merge ends","#green","Merged Config: ",JSON.stringify(mergedConfig));

    var getStraw = function(normal){
        return _getGen(normal,'straws');
    };

    var isAvailable = function(normal){
        var res = false;
        if (normal.isShot)
            res = _getGen(normal,'shots')!=undefined;
        else
            res = getStraw(normal)!==undefined;

        logger.trace("#green","config:isAvailable:",normal,":",res);
        return res;
    };

    var getShot = function(normalIn){
        logger.silly("#green","config:getShot -in-", normalIn);
        var normal = _normalShot(normalIn);
        var globalShot = _getGen(normal,'shots');
        var shot = globalShot.default;
        shot = _mergeObject(shot,globalShot[normal.repoType]);
        logger.silly("#green","config:getShot -out-", shot);
        return shot;
    };

    /**
     * set params in a shot context: with this order of preference
     * 1. .piscosour/piscosour.json
     * 2. your recipe piscosour.json
     * 3. params.json of default
     * 4. params.json of repoType
     * @param normal
     * @returns {*}
     */
    var getShotParams = function(normal){
        logger.silly("#green","config:getShotParams -in-", normal);
        var params = _mergeObject(getShot(normal),mergedConfig.params);
        params = _precededParams(params);
        logger.silly("#green","config:getShotParams -out-", params);
        return params;
    };


    /**
     * set params in a straw context: with this order of preference
     * 1. .piscosour/piscosour.json
     * 2. your recipe piscosour.json
     * 3. straw.json (3.1 - params, 3.2 - defaul, 3.3 - repoType)
     * 4. params.json of default
     * 5. params.json of repoType
     * @param normalShot
     * @param normal
     */
    var getStrawParams = function(normalShot, normal){
        logger.silly("#green","config:getStrawParams -in-","shot:",normalShot,"straw:",normal);
        var straw = getStraw(normal);

        var params = getShot(normalShot);
        params = _mergeObject(params, straw.params);
        if (straw.shots[normalShot.name])
            params = _mergeObject(params, straw.shots[normalShot.name].params);
        if (straw.shots[normalShot.name][normalShot.repoType])
            params = _mergeObject(params, straw.shots[normalShot.name][normalShot.repoType].params);
        params = _mergeObject(params,mergedConfig.params);
        params = _precededParams(params);
        logger.silly("#green","config:getStrawParams -out- ", params);
        return params;
    };

    var getDir = function(name){
        var dir;
        if (config.recipes[name])
            dir = config.recipes[name].dir;
        if (name==="piscosour" && !dir)
            dir = config.recipes.module.dir;
        return dir;
    };

    var load = function(normal){
        logger.silly("#green","config:load -in-", normal);
        var normalCopy = _normalShot(normal);
        normalCopy.params = cmdParams.merge(normal.params);
        var shot = {};
        var plugins = getPlugins(normalCopy);;
        for (var name in config.recipes){
            var recipe = config.recipes[name];
            if (recipe.name)
                shot = loadOne(normalCopy,recipe,shot);
        }
        shot.plugins = plugins;
        logger.silly("#green","config:load -out-", shot);
        return shot;
    };

    var loadOne = function(normal, recipe, shot){
        var filename = path.join(recipe.dir, "shots", normal.name, normal.repoType, "shot.js");
        logger.silly("#green","config:loadOne -in-", filename);
        if (!fsUtils.exists(filename)) {
            logger.trace("#green", "config:load", filename, "doesn't exists!");
            filename = path.join(recipe.dir, "shots", normal.name, "shot.js");
        }
        logger.trace("#green", "config:load", "[", normal.name, "]", filename, "...");

        if (fsUtils.exists(filename)){
            shot = _mergeObject(require(filename), shot);
            shot.runner.name = normal.origName;
            shot.runner.params = normal.params;
        }

        logger.silly("#green","config:loadOne -out-", shot);
        return shot;
    };

    var getPlugins = function(normal){
        var plugins = {};
        for (var recipeName in config.recipes){
            var recipe = config.recipes[recipeName];
            if (recipe.name) {
                if (normal.params.plugins && normal.params.plugins.length>0) {
                    for (var i in normal.params.plugins) {
                        var name = normal.params.plugins[i];
                        var filename = path.join(recipe.dir, "plugins", name, "plugin.js");
                        logger.silly("#green", "config:loadPlugin -in-", filename);
                        if (fsUtils.exists(filename)) {
                            plugins[name] = _mergeObject(require(filename), plugins[name]);
                            if (plugins[name].runner.addons)
                                Shot.setAddons(plugins[name].runner.addons);
                        }

                        logger.silly("#green", "config:loadPlugin -out-", plugins?plugins[name]:"");
                    }
                }
            }
        }
        return plugins;
    };

    //Interface

    mergedConfig.load = load;
    mergedConfig.getDir = getDir;
    mergedConfig.getStraw = getStraw;
    mergedConfig.isAvailable = isAvailable;
    mergedConfig.getShotParams = getShotParams;
    mergedConfig.getStrawParams = getStrawParams;
    mergedConfig.recipes = config.recipes;
    mergedConfig.rootDir = config.rootDir;

    return mergedConfig;
};

var config = Config();

module.exports = config;