[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

![Piscosour: Get all your devops tools wrapped-up!](doc/images/logo.png)

# What is Piscosour?

- Piscosour gets all command line (CLI) development tools wrapped-up, creating ascertainable command line workflows. 
- Piscosour does not replace other tools, coexists with all of them and allows the best symbiosis of them all.
- Piscosour shots are easy and reusable components based on a npm dependency. 
- Piscosour execution creates an easily junit.xml filed to manage with the most popular orchestrators like Jenkins, Hudson, Bamboo, etc.
- Piscosour keeps all sets of tools ordered under the same recipe, so you could have recipes for polymer, AngularJS, react, facilities, system utilities ... and use them in any workflow you need.

We have moved the idea of a component to use it as a tool to build, to test, to use in a continuous integration tool, etc. For all these tasks we have created Piscosour.

**To get an idea, it’s a command line jenkins, bamboo, travis or gocd , which allows better reuse of workflows.** 

Piscosour wraps the functionality of any tool and helps you to:

1. localize.
2. documenting.
3. share.
4. trust.
5. test.
6. versioning.
7. watch the life cycle.
8. watch results

 of all bash scripts, gulp and grunt tasks, yeoman generators, hydrolysis, lint/eslint, polymer tools, cordova tools, sass,  etc.

So, you can use all your favorites tools keeping it under control and versioned.

# Documentation

* [Complete documentation](doc/README.md) - Complete documentation, howtos, api, examples...
* [Spanish documentation](doc/spanish/README.md) - Spanish documentation for piscosour.

# Main Index:

- [Plugins](#plugins)
    - from **piscosour  v.0.6.14**
        - [context](#context)
        - [fsutils](#fsutils)
        - [inquirer](#inquirer)
        - [launcher](#launcher)
        - [os](#os)
        - [piscosour](#piscosour)
        - [skipper](#skipper)
        - [stream-write-hook](#stream-write-hook)
        - [system-checker](#system-checker)
        - [system-saver](#system-saver)
        - [test](#test)
- [Contexts](#contexts)
- [Recipes](#recipes)
- [All Commands Availables](#all-commands-availables)
    - from **piscosour  v.0.6.14**
        - [node-module:convert (Convert any module into a piscosour recipe)](#node-moduleconvert-convert-any-module-into-a-piscosour-recipe)
        - [recipe:add-shot (Add a shot to a piscosour recipe)](#recipeadd-shot-add-a-shot-to-a-piscosour-recipe)
        - [recipe:add-straw (Add a straw to a piscosour recipe)](#recipeadd-straw-add-a-straw-to-a-piscosour-recipe)
        - [recipe:configure (Manage a piscosour recipe)](#recipeconfigure-manage-a-piscosour-recipe)
        - [recipe:create (Starting a repository from scratch)](#recipecreate-starting-a-repository-from-scratch)
        - [recipe:docs (Append documentation from info.md to readme.md of the recipe)](#recipedocs-append-documentation-from-infomd-to-readmemd-of-the-recipe)
        - [all::npm (Checking all npm commands needed)](#allnpm-checking-all-npm-commands-needed)
        - [node-module::convert (Convert any nodejs module into a piscosour recipe)](#node-moduleconvert-convert-any-nodejs-module-into-a-piscosour-recipe)
        - [recipe::add-shots (Create new pisco shot inside this module)](#recipeadd-shots-create-new-pisco-shot-inside-this-module)
        - [recipe::add-straws (Adding shot to a straw)](#recipeadd-straws-adding-shot-to-a-straw)
        - [recipe::configure (Configure piscosour.json)](#recipeconfigure-configure-piscosourjson)
        - [recipe::generate-docs (Generate one file per straw inside a directory)](#recipegenerate-docs-generate-one-file-per-straw-inside-a-directory)
        - [recipe::scaffolding (Create a piscosour recipe from a scaffold template)](#recipescaffolding-create-a-piscosour-recipe-from-a-scaffold-template)
        - [recipe::update (Update tool)](#recipeupdate-update-tool)



# All Commands Availables


###node-module:convert (Convert any module into a piscosour recipe)
[Go Index](#main-index):

How to execute this command:

    pisco node-module:convert


convert straw

#### 1. node-module:convert 'Convert any nodejs module into a piscosour recipe'
General info:

```
Contexts:  node-module
From: piscosour (0.6.14)
```
shot convert

###recipe:add-shot (Add a shot to a piscosour recipe)
[Go Index](#main-index):

How to execute this command:

    pisco recipe:add-shot




#### 1. recipe:add-shots 'Create new pisco shot inside this module'
General info:

```
Contexts:  recipe
From: piscosour (0.6.14)
```
shot shots

###recipe:add-straw (Add a straw to a piscosour recipe)
[Go Index](#main-index):

How to execute this command:

    pisco recipe:add-straw




#### 1. recipe:add-straws 'Adding shot to a straw'
General info:

```
Contexts:  recipe
From: piscosour (0.6.14)
```
shot straws

###recipe:configure (Manage a piscosour recipe)
[Go Index](#main-index):

How to execute this command:

    pisco recipe:configure




#### 1. recipe:configure 'Configure piscosour.json'
General info:

```
Contexts:  recipe
From: piscosour (0.6.14)
```
shot piscosour

###recipe:create (Starting a repository from scratch)
[Go Index](#main-index):

How to execute this command:

    pisco recipe:create



- Pisco te preguntará por el nombre de la receta que quieres crear. Este será el nombre de tu paquete npm que usarás para compartir la funcionalidad y las herramientas que envuelvas. Introduce el nombre que más te guste.
- Deberás introducir el comando que quieres usar para hacer correr los "straws" (flujos) que vas a introducir en este módulo.
- También deberás introducir una breve descripción para tu módulo.

Mientras pisco genera tu primera receta usando un generator de yeoman. Te explicamos brevemente lo que está pasando ante tus ojos. (no te preocupes, más adelante podrás profundizar más). 

"Pisco create" también es un comando envuelto de pisco que está ejecutando otras herramientas. Cada uno de los mensajes que ves aparecer es la ejecución de un shot (paso). Concretamente este comando conlleva la ejecución de estos pasos.

- system: Comprueba que tu sistema es compatible con la ejecución de piscosour
- npm: Comprueba que tienes instalado todos los módulos npm necesarios (yeoman y el generator-pisco-recipe)
- scaffolding: Hace las preguntas y llama a yeoman para generar el esqueleto del módulo.

Listo! ya tienes tu primer ejecutable de pisco creado! pruebalo

#### 1. recipe:scaffolding 'Create a piscosour recipe from a scaffold template'
General info:

```
Contexts:  recipe
From: piscosour (0.6.14)
```
shot scaffolding

###recipe:docs (Append documentation from info.md to readme.md of the recipe)
[Go Index](#main-index):

How to execute this command:

    pisco recipe:docs


Command: **node bin/pisco.js recipe:docs**

Generate documentation for your recipe.

### How to write info.md

Info.md is a regular md file, so you can use all the markdown specification. The only thing that you have to be on mind is the use of titles. 
 
**Inside a info.md use title from third level and beyond**

#### 1. recipe:generate-docs 'Generate one file per straw inside a directory'
General info:

```
Contexts:  recipe
From: piscosour (0.6.14)
```
shot generate-docs


### all::npm 'Checking all npm commands needed'
[Go Index](#main-index):

How to execute this command:

    pisco all::npm

General info:

```
Contexts:  all
From: piscosour (0.6.14)
```
shot npm


### node-module::convert 'Convert any nodejs module into a piscosour recipe'
[Go Index](#main-index):

How to execute this command:

    pisco node-module::convert

General info:

```
Contexts:  node-module
From: piscosour (0.6.14)
```
shot convert


### recipe::add-shots 'Create new pisco shot inside this module'
[Go Index](#main-index):

How to execute this command:

    pisco recipe::add-shots

General info:

```
Contexts:  recipe
From: piscosour (0.6.14)
```
shot shots


### recipe::add-straws 'Adding shot to a straw'
[Go Index](#main-index):

How to execute this command:

    pisco recipe::add-straws

General info:

```
Contexts:  recipe
From: piscosour (0.6.14)
```
shot straws


### recipe::configure 'Configure piscosour.json'
[Go Index](#main-index):

How to execute this command:

    pisco recipe::configure

General info:

```
Contexts:  recipe
From: piscosour (0.6.14)
```
shot piscosour


### recipe::generate-docs 'Generate one file per straw inside a directory'
[Go Index](#main-index):

How to execute this command:

    pisco recipe::generate-docs

General info:

```
Contexts:  recipe
From: piscosour (0.6.14)
```
shot generate-docs


### recipe::scaffolding 'Create a piscosour recipe from a scaffold template'
[Go Index](#main-index):

How to execute this command:

    pisco recipe::scaffolding

General info:

```
Contexts:  recipe
From: piscosour (0.6.14)
```
shot scaffolding


### recipe::update 'Update tool'
[Go Index](#main-index):

How to execute this command:

    pisco recipe::update

General info:

```
Contexts:  recipe
From: piscosour (0.6.14)
```
### Update version of recipe

This shot execute npm install -g **recipeName**. recipeName has to be in params._pkgName


# Plugins


## context
from: **piscosour (0.6.14)**  [Go Index](#main-index)

### Context for the pisco execution

With this plugin you can automatically check where recipe was executed. This plugin take configuration from params and expose two method and make one pre-hook check.
 
#### How two configure repoType definitions

You can configure the repoTypes definition in all the configurations files where pisco recipes are configured [see information for pisco configuration](doc/Load_Parameters.md). 

**Is recommend to use the piscosour.json file of your recipe**

The param is called contexts, and must be a Hash with the name of the repoType as key and Array with all the rules the repo must to match.

example of piscosour.json:
```
    "params": {
        "contexts": {
            "node-module": [
                {
                    "file": "package.json",
                    "conditions": [
                        "that.version"
                    ]
                },
                {
                    "file": "piscosour.json",
                    "noexists": "true"
                }
            ],
            "recipe": [
                {
                    "sufficient": true,
                    "file": ".piscosour/piscosour.json",
                    "conditions": [
                        "that.repoType==='recipe'"
                    ]
                },
                {
                    "file": "package.json",
                    "conditions": [
                        "that.keywords.indexOf('piscosour-recipe')>=0"
                    ]
                },
                {
                    "file": "piscosour.json"
                }
            ]
        }
    },
```

**Rules:**

Define all rules that a repoType must match. All rules not sufficient must to be satisfied.

- **file:** The path of the file relative to the root of the repoType. (for exemple: package.json for a node-module)
- **sufficient:** If this rule is matched the rest of the rules are ignored. If is not matched, the rule is ignored and the rest of rules are evaluated (default: false)
- **noexist:** Check if the file is **not** present. (default: false)
- **conditions:** Is an array with all the conditions that the file must to match. 
  1. The file must to be a correct json file.
  2. **that** is the instance of the json object.
  3. write one condition per element in your array. 
  4. The conditions were evaluated using javascript.

#### Pre-hook: Check one shot is executed in the root of any repository type.

By default, the shot behaviour is assume that repoType is mandatory, if you need to execute one shot without this check of context, use **contextFree** parameter. **contextFree** usually is used for shotd like "create" or something like that.  

only parametrized in params.json:

```
{
 [...]
  "contextFree" : true
}
```

A user command (straw) only could be contextFree if all of its shots are contextFree. If only one shot of a straw is not contextFree then the context will be checked.

**Disable this check using options in the command line**: Is possible to disable this check using this option in the command line: **--b-disableContextCheck**. Usefull for system requirements checks.

#### addon: this.ctxIs

| Param | Description |
| --- | --- |
| name | name of the repoType to test|


Use this.ctxIs to ask pisco where was executed.

```
let isComponent = this.ctxIs("component");
```

isComponent must to be true if your recipe was executed in the root of a component.

#### addon: this.ctxWhoami

Ask pisco the repoTypes of the directory where you executed your recipe.

```
let repos = this.ctxWhoami();
```

repos is an Array of types that match the place where your recipe was executed.
## fsutils
from: **piscosour (0.6.14)**  [Go Index](#main-index)

### fs plugin (fs addons for piscosour)

#### this.fsCreateDir

| Param | Description |
| --- | --- |
| | |

#### this.fsExists

| Param | Description |
| --- | --- |
| | |

#### this.fsReadConfig

| Param | Description |
| --- | --- |
| | |

#### this.fsReadFile

| Param | Description |
| --- | --- |
| | |

#### this.fsCopyDirFiltered

| Param | Description |
| --- | --- |
| | |

#### this.fsCopyFileFiltered

| Param | Description |
| --- | --- |
| | |

#### this.fsAppendBundle

| Param | Description |
| --- | --- |
| | |

## inquirer
from: **piscosour (0.6.14)**  [Go Index](#main-index)

### Inquirer plugin

This plugin use inquirer library [Inquirer documentation](https://www.npmjs.com/package/inquirer)

set type 

params.json
```
  "prompts": [
    {
      "type": "#setType()",
      "name": "doDefault",
      "required": true,
      "message": "Do you want to set default repository type?"
    }
  ],
```

- '#' indicate that is necesary to use a function in the shot in order to resolve the type value.
- '()' set that pisco needs to execute this function on order to get the value. 

shot.js
```
  setType: function() {
    return 'confirm';
  },
```

#### this.inquire

| Param | Description |
| --- | --- |
| | |
## launcher
from: **piscosour (0.6.14)**  [Go Index](#main-index)

### Execute any command with pisco.

Core plugin used to execute any command inside pisco.

#### this.sh

| Param | Description |
| --- | --- |
| command | command that you want to execute|
| reject | reject function, called if command fails (stop overall execcution)|
| loud | Boolean if true echo of command is done|

Syncronous method use to execute any command in your environment.

#### this.sudo

| Param | Description |
| --- | --- |
| | |

#### this.executeSync

| Param | Description |
| --- | --- |
| | |

#### this.executeStreamed

| Param | Description |
| --- | --- |
| | |

#### this.execute

| Param | Description |
| --- | --- |
| | |

#### this.executeParallel

| Param | Description |
| --- | --- |
| | |
## os
from: **piscosour (0.6.14)**  [Go Index](#main-index)


Plugins used to check Operating System where pisco is running

###Addons:

#### this.isWin();

return true if the Operation System where pisco is executed is Windows.

#### this.isMac();

return true if the Operation System where pisco is executed is MacOS.
## piscosour
from: **piscosour (0.6.14)**  [Go Index](#main-index)

### Expose piscosour config

Expose core configuration to shots.

#### this.config

Expose the piscosour config object [Trabajar con shots](doc/api.md#Config)
  
#### this.piscoFile

return the literal: 'piscosour.json'

#### this.pkgFile

return the literal: 'package.json'


## skipper
from: **piscosour (0.6.14)**  [Go Index](#main-index)

### Skipper plugin

Skips the shot execution when receiving the param "\_skip": true

## stream-write-hook
from: **piscosour (0.6.14)**  [Go Index](#main-index)

### Intercepts any stream flow in order to be able to manage the information inside.

This way you can capture all the output of any stream and do whatever you want with it. The way to do this has two stages:

#### 1. Start intercepting the stream

At any place in yor code is posible to intercept any stream the only thing you have to do is use streamWriteHook method:

```
   let capture = '';
   this.streamWriteHook(process.stdout, function(chunk, encoding, cb) {
     capture += stripcolorcodes(chunk.toString(encoding));
   });
```

(*) stripcolorcodes() is used to deleting all coloured characters from stream. 
  
Capture will contain all from content of process.stdout

#### 2. Stop intercepting the stream.

Is necesary to do release all system resources, so do this:

```
   this.streamWriteUnhook(process.stdout);
```

### Addons:

#### this.streamWriteHook

starts the hook

| Param | Description |
| --- | --- |
|stream |Stream to be hooked |
|cb |Function to call each time chunk is append to stream |

#### this.streamWriteUnhook

stops the hook

| Param | Description |
| --- | --- |
|stream |Stream to be Unhooked |



## system-checker
from: **piscosour (0.6.14)**  [Go Index](#main-index)

### How to check system requirements of a piscosour command.

The system requirements are other commands that pisco needs for a pipeline execution. This plugin checks if everything is installed and ready to use by piscosour.

#### 1. Define version match (Only in the cases where could be diferent)

By default version is taken asking the command with -v and assume that command return version plain without test.

    bower -v 
    > 1.7.9

But in some cases this is not true, in this cases you can define matches inside **piscosour.json**:  

Example of piscosour.json
```
{
  [...]  
  "params": {
    [...]
    "versions": {
      "java": {
        "option" : "-version",
        "regexp" : "\"(.*?)_"
      },
      [...]
    },
  [...]
}
```

By default this is the versions defined inside core:

```
    "versions": {
      "bower" : {
        "npm": true,
        "list": "bower cache list",
        "cmdInstaller": "bower install"        
      },
      "npm" : {
        "list": "npm list -g --depth 0",
        "regexp": "\\@(.*?)\\s"
        "cmdInstaller": "npm install -g"
      },    
      "java": {
        "option" : "-version",
        "regexp" : "\"(.*?)_"
      },
      "sass" : {
        "regexp" : "s (.*?) "
      },
      "git": {
        "option" : "--version",
        "regexp" : "n (.*?)\\n"
      }
    }
```

- **key** (for example 'java'): is the command that you need inside your shot.
- **option**: (optional, default is '-v') if version is set the way to check this version.
- **regexp**: (optional) if version is on a string the way to extract only the version. Overwrite version defined on piscosour.json
- **list:** (optional) command used to get a stdout to use the regexp function in orther to get the version of the item you want to check.
- **cmdInstaller:** (optional) command used to install packages using this key (for example 'npm install -g' or 'bower install')

##### List tip

Useful when you want to check if some dependency is listed by any command. 
 
 1. Set list in version (f.i. in npm)
 2. In any other requirement set listedIn: (f.i. module: set listedIn: npm)

this pugling is going to check the version returned when the match with regexp is done.

#### 2. Define system requirements in all your shots.

The system requirements are defined in **params.json** file inside every shot.

-**requirements** All dependencies are defined inside requirements

Example of params.json:
```
{
  "requirements": {
    "polymer" : {
      "installer": "bower",
      "listedIn": "bower",
      "uri": "https://github.com/Polymer/polymer.git#v1.6.1",
      "regexp": "=(.*?)"
    },
    "generator-pisco-recipe" : {
      "installer": "npm",
      "listedIn": "npm",
      "version" : "0.0.2"
    },
    "pisco" : {
      "installer": "npm",
      "pkg" : "piscosour",
      "version" : "0.5.0"
    },
    "cordova" : {
      "installer": "npm",
      "version" : "5.4.1"
    },
    "yo" : {"npm": true},
    "bower" : {
      "installer": "npm",
      "version" : "1.7.9"
    },
    "java": {
      "version": "1.7.0"
    },
    "sass" : {
      "version": "3.1.0"
    }
  },
  [...]
}
```

This is the possible parameters that you need in order to define a system requirement.

- **key** (for example 'java'): is the command that you need inside your shot.
- **installer** (optional): package command, search inside requirements to check the cmdInstaller.
- **version**: (optional) is the minimum version that you need for the command. Overwrite version defined on piscosour.json
- **option**: (optional, default is '-v') if version is set the way to check this version.
- **regexp**: (optional) if version is on a string the way to extract only the version. Overwrite version defined on piscosour.json
- **listedIn**: (optional) use the 'list' value of this parameter in order to check if this dependency is available.
- **uri**: (optional) only apply in npm commands. Uri of the git repo.
- **pkg**: (optional) only apply in npm commands. Used when executable and pkg are different.
 
#### 3. Check if a pisco command has all system requirements satisfied

    cells component:validate --pstage core-check --b-disablePrompts --b-disableContextCheck
    
Command explanation:

- **cells component:validate**: is the pisco command that you want to check.
- **--pstage core-check**: this means that only the core-check stage is executed for all the pipeline. System requirements check is a **pre-hook** of the stage **core-check** so you have to execute only this stage.
- **--b-disablePrompts**: disable all prompts for the command.
- **--b-disableContextCheck**: disable context checks for commands that need one.

this is the result of the execution for every shot that would have system requirements defined:

```
[12:14:32] java ( 1.7.0 ) is required ->  java ( 1.8.0_65 ) impossible to parse ... WARNING!
[12:14:33] cordova ( 5.4.1 ) is required ->  cordova ( 5.4.1 ) is installed ... OK
[12:14:34] yo ( any version ) is required ->  yo is installed ... OK
[12:14:35] bower ( 1.0.0 ) is required ->  bower ( 1.7.7 ) is installed ... OK
[12:14:35] sass ( 3.1.0 ) is required ->  sass ( 3.4.19 ) is installed ... OK
```

If any system requirement is not satisfied the command will throw an error and stops...
## system-saver
from: **piscosour (0.6.14)**  [Go Index](#main-index)

### Write the requirements into a global file 'requirements.json'

    cells component:validate --pstage check --b-saveRequirements --b-disablePrompts --b-disableContextCheck --b-disableSystemCheck
    
Command explanation:

- **cells component:validate**: is the pisco command that you want to check.
- **--pstage check**: this means that only the check stage is executed for all the pipeline. System requirements check is a **pre-hook** of the stage **check** so you have to execute only this stage.
- **--b-saveRequirements**: tells pisco to save all system requirements in one file.
- **--b-disablePrompts**: disable all prompts for the command. 
- **--b-disableContextCheck**: disable context checks for commands that need one.
- **--b-disableSystemCheck**: disable system checks in order to avoid vicious cycle.

this is the file resulting of the execution: the mix of all system requirements for all shots.

```
{
  "npm": {
    "module": "generator-pisco-recipe",
    "version": "0.0.2"
  },
  "java": {
    "version": "1.7.0",
    "option": "-version",
    "regexp": "\"(.*?)_"
  },
  "cordova": {
    "version": "5.4.1"
  },
  "yo": {},
  "bower": {
    "version": "1.0.0"
  },
  "sass": {
    "version": "3.1.0",
    "regexp": "s (.*?) "
  }
}
```
## test
from: **piscosour (0.6.14)**  [Go Index](#main-index)

Testing plugin. NO FUNCTIONALITY.
# Contexts


[Go Index](#main-index):

|Name|Description|
|---|---|
|node-module| |
|recipe| |



# Recipes


[Go Index](#main-index):

|Name|Version|Description|
|---|---|---|
|piscosour|0.6.14|Get all your devops tools wrapped-up!|


