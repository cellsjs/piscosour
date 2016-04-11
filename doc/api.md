## Modules

<dl>
<dt><a href="#module_Chef">Chef</a> ⇒ <code>Object</code></dt>
<dd><p><strong>Internal:</strong></p>
<p>Read all piscosour.json files of every recipes imported in one module and prepare one json object with all the information.</p>
<p>This module is used only in module <strong>config.js</strong></p>
</dd>
<dt><a href="#module_docs">docs</a></dt>
<dd><p>Module used for CLI help. Shows all CLI commands and options.</p>
</dd>
<dt><a href="#module_FinalCheck">FinalCheck</a> ⇒</dt>
<dd><p>This module check all the information stored during the execution.
If -u option is passed to the CLI junit.xml file is generated in this module.</p>
</dd>
<dt><a href="#module_logger">logger</a></dt>
<dd><p>Generate logger wrapper to be use inside a Shot.</p>
<p>There are 6 levels:</p>
<ol>
<li>silly,</li>
<li>debug,</li>
<li>verbose,</li>
<li>info,</li>
<li>warning,</li>
<li>error</li>
</ol>
<p>Formating messages is possible with chalk tags...</p>
<p>Example of use inside shot</p>
<pre><code>this.logger.info(&quot;#green&quot;,&quot;text&quot;);
</code></pre></dd>
<dt><a href="#module_scullion">scullion</a> ⇒ <code>Object</code></dt>
<dd><p><strong>Internal:</strong></p>
<p>Prepare the config object to be use by the config module.</p>
</dd>
<dt><a href="#module_shooter">shooter</a> ⇒ <code>Object</code></dt>
<dd><p>Run one shot. Is the responsible to run all the stages of a shot.</p>
</dd>
<dt><a href="#module_sipper">sipper</a></dt>
<dd><p><strong>Internal:</strong></p>
<p>Execute in waterfall all the shots of a straw.</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#Config">Config</a></dt>
<dd></dd>
<dt><a href="#Plugin">Plugin</a></dt>
<dd></dd>
<dt><a href="#Shot">Shot</a></dt>
<dd></dd>
<dt><a href="#Sour">Sour</a></dt>
<dd></dd>
</dl>

<a name="module_Chef"></a>

## Chef ⇒ <code>Object</code>
**Internal:**

Read all piscosour.json files of every recipes imported in one module and prepare one json object with all the information.

This module is used only in module **config.js**

<a name="module_docs"></a>

## docs
Module used for CLI help. Shows all CLI commands and options.

<a name="module_FinalCheck"></a>

## FinalCheck ⇒
This module check all the information stored during the execution.
If -u option is passed to the CLI junit.xml file is generated in this module.

**Returns**: true if there was no error in the execution  
<a name="module_logger"></a>

## logger
Generate logger wrapper to be use inside a Shot.

There are 6 levels:

5. silly,
4. debug,
3. verbose,
2. info,
1. warning,
0. error

Formating messages is possible with chalk tags...

Example of use inside shot

```
this.logger.info("#green","text");
```

<a name="module_scullion"></a>

## scullion ⇒ <code>Object</code>
**Internal:**

Prepare the config object to be use by the config module.

<a name="module_shooter"></a>

## shooter ⇒ <code>Object</code>
Run one shot. Is the responsible to run all the stages of a shot.

<a name="module_sipper"></a>

## sipper
**Internal:**

Execute in waterfall all the shots of a straw.

<a name="Config"></a>

## Config
**Kind**: global class  

* [Config](#Config)
    * [new Config()](#new_Config_new)
    * [~getStraw(normal:)](#Config..getStraw) ⇒
    * [~isAvailable(normal)](#Config..isAvailable) ⇒ <code>boolean</code>
    * [~getShotInfo(name)](#Config..getShotInfo) ⇒ <code>Object</code>
    * [~getShotParams(normal)](#Config..getShotParams) ⇒ <code>\*</code>
    * [~getStrawParams(normalShot, normal)](#Config..getStrawParams)
    * [~getDir(name)](#Config..getDir) ⇒
    * [~load(normal)](#Config..load) ⇒ <code>Object</code>

<a name="new_Config_new"></a>

### new Config()
Builds a config object with all the configuration of one execution. This object is build in the begging of every execution and is use by all the piscosour elements.

<a name="Config..getStraw"></a>

### Config~getStraw(normal:) ⇒
Example inside a shot.

```
var straw = this.config.getStraw(normal);
```

**Kind**: inner method of <code>[Config](#Config)</code>  
**Returns**: Object with the configuration of a straw.  

| Param | Description |
| --- | --- |
| normal: | Object with the repoType , name, recipeKey of the straw that you |

<a name="Config..isAvailable"></a>

### Config~isAvailable(normal) ⇒ <code>boolean</code>
normal has this aspect:

```
normal = {name: *, repoType: *, orig: *, recipe: *, isShot: *}
```
Checks if a normal object is available in this recipe

**Kind**: inner method of <code>[Config](#Config)</code>  

| Param |
| --- |
| normal | 

<a name="Config..getShotInfo"></a>

### Config~getShotInfo(name) ⇒ <code>Object</code>
Obtain all information of a shot.

**Kind**: inner method of <code>[Config](#Config)</code>  
**Returns**: <code>Object</code> - types: All types where implementation is available, recipes: All recipes that this shot is implemented, description: Text describing this shot.  

| Param |
| --- |
| name | 

<a name="Config..getShotParams"></a>

### Config~getShotParams(normal) ⇒ <code>\*</code>
set params in a shot context: with this order of preference
1. .piscosour/piscosour.json
2. your recipe piscosour.json
3. params.json of default
4. params.json of repoType

**Kind**: inner method of <code>[Config](#Config)</code>  

| Param |
| --- |
| normal | 

<a name="Config..getStrawParams"></a>

### Config~getStrawParams(normalShot, normal)
set params in a straw context: with this order of preference
1. .piscosour/piscosour.json
2. your recipe piscosour.json
3. straw.json (3.1 - params, 3.2 - defaul, 3.3 - repoType)
4. params.json of default
5. params.json of repoType

**Kind**: inner method of <code>[Config](#Config)</code>  

| Param |
| --- |
| normalShot | 
| normal | 

<a name="Config..getDir"></a>

### Config~getDir(name) ⇒
obtain the location of a recipe in the fileSystem.

**Kind**: inner method of <code>[Config](#Config)</code>  
**Returns**: String: Directory of one recipe  

| Param | Description |
| --- | --- |
| name | recipeKey |

<a name="Config..load"></a>

### Config~load(normal) ⇒ <code>Object</code>
Instanciate a shot **new Shot** from all configurations in all recipes

**Kind**: inner method of <code>[Config](#Config)</code>  
**Returns**: <code>Object</code> - Object Shot, with all the plugins and configurations inyected  

| Param |
| --- |
| normal | 

<a name="Plugin"></a>

## Plugin
**Kind**: global class  
<a name="new_Plugin_new"></a>

### new Plugin(hook:)
# What is a plugin?

Plugin is prototype used to share functionality transversely between shots and straws. The prototype plugin works in two distinct ways.
 
 1. As hook (or prior interceptor) on each phase of the shot where is configured.
 2. As addons repository (methods added to the prototype shot) that add functionality to the object shot transparently.
 
A plugin looks like this

```Js
'Use strict';

module.exports = {
    description: "Test plugin"

    // ---- ---- HOOKS

    check: function (shot) {
        this.logger.info ( "TEST -------- --------- PLUGIN");
        shot.test_pluginAddon ( "Example");
    },
    
    // ---- ---- ADDONS

    addons: {

        testPluginAddon: function (message) {
            this.logger.info ( "Test addon executed", name);
        }
    }
};
```

## HOOKS
 - In hooks **this** will be the reference to the shot instance, so all the properties and functions are availables.
 - The functions of the hooks must have the same name as the stage (stage) that will precede.
 - They must return a Promise or undefined. **It is not allowed to return other value**.
    
## ADDONS
 - The methods addons are added to the prototype Shot will therefore be able to run from any reference to the prototype.
 - Within a function addon **this** refers to the shot where is running, it will be a reference to the instance currently running yet fully charged.
 - ** ATTENTION: plugins add features to prototype Shot **. To not overwrite sensitive functions Shot using one of two methods:
  
  1. (recommended): Preset functions added to the plugin name. In our example will be **test**.
  2. Create a namespace: This solution loses the reference to **this**, shot would have to be passed to the shot when calling the function. In our example:
  
  **Plugin.js :**
  
```Js
'Use strict';

module.exports = {
    description: "Test plugin"

    // ---- ---- HOOKS

    check: function () {
        this.logger.info ( "TEST -------- --------- PLUGIN");
        this.test.pluginAddon (this, "Example");
    },
    
    // ---- ---- ADDONS

    addons: {
        test: {
            pluginAddon: function (shot, message) {
                shot.logger.info ( "Test addon executed", message);
            }
        }
    }
};
```


# How to create a plugin?

The plugins can be created in any recipe and use in other recipes just importing the dependency in the package.json file. Create a plugin is as simple as:

1. Create a folder plugins in the root of your recipe.
2. Create a folder with the name you want to give the plugin.
3. Create a file called plugin.js ** ** within this folder with the content inidicado above. It is convenient to add a info.md ​​with specific documentation plugin file.
4. Ready! you have your plugin created!

It is advisable to create plugins in separate recipes, ie, create a recipe only with a plugin or several related in order to make a better management of the dependencies that these plugins needed.

# How to use a plugin?

Using a plugin is very simple, follow these steps:

1. If the plug is not in your recipe matter npm package recipe where the plugin is located.
    
    npm install --save my-plugins
    
2. Define the name of the plugin in any of the "Scopes" pisco piscosour.json, straw.json, params.json [See definition of parameters] (Load_Parameters.md).

piscosour.json and straw.json

```Js
[....]
  "Params": {
   "Plugins": [ "test"]
 },
[....]
```

params.json

```Js
{
    "Plugins": [ "test"]
}
```

3. Ready !. The plugin execute all hooks have partners and the shot will have all the addons that have been defined.
 
 In our example this would be the code test shot using the plugin:


```Js
 'Use strict';
 
 module.exports = {
    description: "test shot Plugins"

    config: function (resolve) {
        this.logger.info ( "magenta #", "config", "params Preparing for main execution");
    },

    run: function (RESOLVE) {
        this.logger.info ( "# magenta", "run", "Run main execution");
        shot.test_pluginAddon ( "our example !!");
    },

    prove: function (RESOLVE) {
        this.logger.info ( "magenta #", "prove", "Prove That the run execution was ok");
    },

    notify: function (RESOLVE) {
        this.logger.info ( "# magenta", "notify", "Recollect all execution information and notify");
    }
};
```

When you run the shot aand message:

![First plugin execution](images/plugins1.png)


| Param | Description |
| --- | --- |
| hook: | is the stages of the shot that the plugin is going to hook executions of functions. |

<a name="Shot"></a>

## Shot
**Kind**: global class  

* [Shot](#Shot)
    * [new Shot(runner)](#new_Shot_new)
    * [.report(result)](#Shot+report)
    * [.save(key, obj, isGlobal)](#Shot+save)
    * [.get(key, shotName)](#Shot+get) ⇒ <code>\*</code>

<a name="new_Shot_new"></a>

### new Shot(runner)
A shot is a **Step** in a execution. **Straws** are considered as a pipeline.


| Param | Description |
| --- | --- |
| runner | this is the configuration object inside a shot. |

<a name="Shot+report"></a>

### shot.report(result)
Write reporting information of the shot.

example:
result has this aspect:
```
var result = {
              status: 1|0,
              message: "some text",
              content: "some text",
              time: time in milliseconds,
              order: number,
              last: last
          };
this.report(result);
```

**Kind**: instance method of <code>[Shot](#Shot)</code>  

| Param | Description |
| --- | --- |
| result | The object above |

<a name="Shot+save"></a>

### shot.save(key, obj, isGlobal)
Save any object in the global context and is posible to use by any other shot in the straw.
Example in any shot:

```js
[...]
this.save('key',{param: 1}, true);
[...]
```

**Kind**: instance method of <code>[Shot](#Shot)</code>  

| Param | Description |
| --- | --- |
| key | used to store the object in the global context. |
| obj | obj to be store |
| isGlobal | If is set name of shot is not necesary to retrive it. |

<a name="Shot+get"></a>

### shot.get(key, shotName) ⇒ <code>\*</code>
Get any other param store in global context using save
Example:

```js
 var other = this.get('key');
```

**Kind**: instance method of <code>[Shot](#Shot)</code>  
**Returns**: <code>\*</code> - - the value or undefined if is not found.  

| Param | Description |
| --- | --- |
| key | used to store the object |
| shotName | name of the shot that store the object or undefined of isGlobal was true. |

<a name="Sour"></a>

## Sour
**Kind**: global class  

* [Sour](#Sour)
    * [new Sour()](#new_Sour_new)
    * [~gush()](#Sour..gush) ⇒ <code>Promise</code>

<a name="new_Sour_new"></a>

### new Sour()
Sour is the commands line interface

**Returns**: gush : execute the commands.  
<a name="Sour..gush"></a>

### Sour~gush() ⇒ <code>Promise</code>
Execute all the commands of the utility

**Kind**: inner method of <code>[Sour](#Sour)</code>  
