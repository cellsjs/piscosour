/*jshint node:true */

'use strict';

/**
 *
 * # What is a plugin?
 *
 * Plugin is prototype used to share functionality transversely between shots and straws. The prototype plugin works in two distinct ways.
 *  
 *  1. As hook (or prior interceptor) on each phase of the shot where is configured.
 *  2. As addons repository (methods added to the prototype shot) that add functionality to the object shot transparently.
 *  
 * A plugin looks like this
 *
 * ```Js
 * 'Use strict';
 *
 * module.exports = {
 *    description: "Test plugin"
 *
 *    // ---- ---- HOOKS
 *
 *    check: function (shot) {
 *        this.logger.info ( "TEST -------- --------- PLUGIN");
 *        shot.test_pluginAddon ( "Example");
 *    },
 *    
 *    // ---- ---- ADDONS
 *
 *    addons: {
 *
 *        testPluginAddon: function (message) {
 *            this.logger.info ( "Test addon executed", name);
 *        }
 *    }
 *};
 * ```
 *
 * ## HOOKS
 *  - In hooks **this** will be the reference to the shot instance, so all the properties and functions are availables.
 *  - The functions of the hooks must have the same name as the stage (stage) that will precede.
 *  - They must return a Promise or undefined. **It is not allowed to return other value**.
 *     
 * ## ADDONS
 *  - The methods addons are added to the prototype Shot will therefore be able to run from any reference to the prototype.
 *  - Within a function addon **this** refers to the shot where is running, it will be a reference to the instance currently running yet fully charged.
 *  - ** ATTENTION: plugins add features to prototype Shot **. To not overwrite sensitive functions Shot using one of two methods:
 *   
 *   1. (recommended): Preset functions added to the plugin name. In our example will be **test**.
 *   2. Create a namespace: This solution loses the reference to **this**, shot would have to be passed to the shot when calling the function. In our example:
 *   
 *   **Plugin.js :**
 *   
 * ```Js
 * 'Use strict';
 *
 * module.exports = {
 *    description: "Test plugin"
 *
 *    // ---- ---- HOOKS
 *
 *    check: function () {
 *        this.logger.info ( "TEST -------- --------- PLUGIN");
 *        this.test.pluginAddon (this, "Example");
 *    },
 *    
 *    // ---- ---- ADDONS
 *
 *    addons: {
 *        test: {
 *            pluginAddon: function (shot, message) {
 *                shot.logger.info ( "Test addon executed", message);
 *            }
 *        }
 *    }
 *};
 * ```
 *
 *
 *# How to create a plugin?
 *
 *The plugins can be created in any recipe and use in other recipes just importing the dependency in the package.json file. Create a plugin is as simple as:
 *
 *1. Create a folder plugins in the root of your recipe.
 *2. Create a folder with the name you want to give the plugin.
 *3. Create a file called plugin.js ** ** within this folder with the content inidicado above. It is convenient to add a info.md ​​with specific documentation plugin file.
 *4. Ready! you have your plugin created!
 *
 *It is advisable to create plugins in separate recipes, ie, create a recipe only with a plugin or several related in order to make a better management of the dependencies that these plugins needed.
 *
 *# How to use a plugin?
 *
 *Using a plugin is very simple, follow these steps:
 *
 *1. If the plug is not in your recipe matter npm package recipe where the plugin is located.
 *    
 *    npm install --save my-plugins
 *    
 *2. Define the name of the plugin in any of the "Scopes" pisco piscosour.json, straw.json, params.json [See definition of parameters] (Load_Parameters.md).
 *
 *piscosour.json and straw.json
 *
 *```Js
 *[....]
 *  "Params": {
 *   "Plugins": [ "test"]
 * },
 *[....]
 *```
 *
 *params.json
 *
 *```Js
 *{
 *    "Plugins": [ "test"]
 *}
 *```
 *
 *3. Ready !. The plugin execute all hooks have partners and the shot will have all the addons that have been defined.
 * 
 * In our example this would be the code test shot using the plugin:
 *
 *
 *```Js
 * 'Use strict';
 * 
 * module.exports = {
 *    description: "test shot Plugins"
 *
 *    config: function (resolve) {
 *        this.logger.info ( "magenta #", "config", "params Preparing for main execution");
 *    },
 *
 *    run: function (RESOLVE) {
 *        this.logger.info ( "# magenta", "run", "Run main execution");
 *        shot.test_pluginAddon ( "our example !!");
 *    },
 *
 *    prove: function (RESOLVE) {
 *        this.logger.info ( "magenta #", "prove", "Prove That the run execution was ok");
 *    },
 *
 *    notify: function (RESOLVE) {
 *        this.logger.info ( "# magenta", "notify", "Recollect all execution information and notify");
 *    }
 *};
 *```
 *
 *When you run the shot aand message:
 *
 *![First plugin execution](images/plugins1.png)
 *
 * @param hook: is the stages of the shot that the plugin is going to hook executions of functions.
 * @returns {Plugin}
 * @constructor Plugin
 */
var Plugin = function(hook){
    for (var name in hook) {
        this[name] = hook[name];
    }
    return this;
};

module.exports = Plugin;