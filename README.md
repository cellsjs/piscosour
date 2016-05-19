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

# Installing piscosour

Install piscosour globally

    npm install -g piscosour


# Recipes


|Name|Version|Description|
|---|---|---|
|piscosour|0.5.3|Get all your devops tools wrapped-up!|



# Commands



**from piscosour  v.0.5.3:**

- **pisco node-module::convert** ( Convert any nodejs module into a piscosour recipe )
- **pisco recipe::generate-docs** ( Generate one file per straw inside a directory )
- **pisco all::npm** ( Checking all npm commands needed )
- **pisco recipe::piscosour** ( Configure piscosour.json )
- **pisco recipe::scaffolding** ( Create a piscosour recipe from a scaffold template )
- **pisco recipe::shots** ( Create new pisco shot inside this module )
- **pisco recipe::straws** ( Adding shot to a straw )
- **pisco recipe::updateversion** ( Update tool )
- **pisco recipe:add-shot** ( Add a shot to a piscosour recipe )
- **pisco recipe:add-straw** ( Add a straw to a piscosour recipe )
- **pisco recipe:config** ( Manage a piscosour recipe )
- **pisco node-module:convert** ( Convert any module into a piscosour recipe )
- **pisco recipe:create** ( Starting a repository from scratch )
- **pisco recipe:docs** ( Append documentation from info.md to readme.md of the recipe )



## add-shot: 'Add a shot'
Add a shot to a piscosour recipe


### 1. shots: 'Create new pisco shot inside this module'
```
Repository types:  recipe
Recipes: piscosour (0.5.3)
```
shot shots

## add-straw: 'Add straw'
Add a straw to a piscosour recipe


### 1. straws: 'Adding shot to a straw'
```
Repository types:  recipe
Recipes: piscosour (0.5.3)
```
shot straws

## config: 'Configure piscosour'
Manage a piscosour recipe


### 1. piscosour: 'Configure piscosour.json'
```
Repository types:  recipe
Recipes: piscosour (0.5.3)
```
shot piscosour

## convert: 'Module to recipe'
Convert any module into a piscosour recipe


### 1. convert: 'Convert any nodejs module into a piscosour recipe'
```
Repository types:  node-module
Recipes: piscosour (0.5.3)
```
shot convert

## create: 'Create from scratch'
Starting a repository from scratch

- Pisco te preguntará por el nombre de la receta que quieres crear. Este será el nombre de tu paquete npm que usarás para compartir la funcionalidad y las herramientas que envuelvas. Introduce el nombre que más te guste.
- Deberás introducir el comando que quieres usar para hacer correr los "straws" (flujos) que vas a introducir en este módulo.
- También deberás introducir una breve descripción para tu módulo.

Mientras pisco genera tu primera receta usando un generator de yeoman. Te explicamos brevemente lo que está pasando ante tus ojos. (no te preocupes, más adelante podrás profundizar más). 

"Pisco create" también es un comando envuelto de pisco que está ejecutando otras herramientas. Cada uno de los mensajes que ves aparecer es la ejecución de un shot (paso). Concretamente este comando conlleva la ejecución de estos pasos.

- system: Comprueba que tu sistema es compatible con la ejecución de piscosour
- npm: Comprueba que tienes instalado todos los módulos npm necesarios (yeoman y el generator-pisco-recipe)
- scaffolding: Hace las preguntas y llama a yeoman para generar el esqueleto del módulo.

Listo! ya tienes tu primer ejecutable de pisco creado! pruebalo

### 1. npm: 'Checking all npm commands needed'
```
Repository types:  all
Recipes: piscosour (0.5.3)
```
shot npm


### 2. scaffolding: 'Create a piscosour recipe from a scaffold template'
```
Repository types:  recipe
Recipes: piscosour (0.5.3)
```
shot scaffolding

## docs: 'Generate Documentation'
Append documentation from info.md to readme.md of the recipe
Command: **node bin/pisco.js recipe:docs**

Generate documentation for your recipe.

### How to write info.md

Info.md is a regular md file, so you can use all the markdown specification. The only thing that you have to be on mind is the use of titles. 
 
**Inside a info.md use title from third level and beyond**

### 1. generate-docs: 'Generate one file per straw inside a directory'
```
Repository types:  recipe
Recipes: piscosour (0.5.3)
```
shot generate-docs


# Plugins


## context

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
- **sufficient:** If this rule is matched the rest of the rules are ignored. If is not match the remaing rules are evaluated (default: false)
- **noexist:** Check if the file is **not** present. (default: false)
- **conditions:** Is an array with all the conditions that the file must to match. 
  1. The file must to be a correct json file.
  2. **that** is the instance of the json object.
  3. write one condition per element in your array. 
  4. The conditions were evaluated using javascript.

#### Pre-hook: Check one shot is executed in the root of any repository type.

Actually by default the behaviour of the shot is assuming that the repoType is mandatory, if you need to execute one shot without this check of context, use **contextFree** parameter. **contextFree** usually is used for shotd like "create" or something like that.  

only parametrized in params.json:

```
{
 [...]
  "contextFree" : true
}
```

A user command (straw) only could be contextFree if all of its shots are contextFree. If only one shot of a straw is not contextFree then the context will be checked.

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

### Inquirer plugin

This plugin use inquirer library [Inquirer documentation](https://www.npmjs.com/package/inquirer)

#### this.inquire

| Param | Description |
| --- | --- |
| | |
## launcher

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


Plugins used to check Operating System where pisco is running

###Addons:

#### this.isWin();

return true if the Operation System where pisco is executed is Windows.

#### this.isMac();

return true if the Operation System where pisco is executed is MacOS.
## piscosour

### Expose piscosour config

Expose core configuration to shots.

#### this.config

Expose the piscosour config object [Trabajar con shots](doc/api.md#Config)
  
#### this.piscoFile

return the literal: 'piscosour.json'

#### this.pkgFile

return the literal: 'package.json'


## skipper

### Skipper plugin

Skips the shot execution when receiving the param "\_skip": true

## system-checker

### How to check system requirements of a piscosour command.

The system requirements are other commands that pisco needs for a pipeline execution. This plugin checks if everything is installed and ready to use by piscosour.

#### 1. Define system requirements in all your shots.

The system requirements are defined in **params.json** file inside every shot.

Example of params.json:
```
{
  "requirements": {
    "java": {
      "version": "1.7.0",
      "option" : "-version",
      "regexp" : "\"(.*?)\""
    },
    "cordova" : {
      "version" : "5.4.1"
    },
    "yo" : {},
    "bower" : {
      "version" : "1.0.0"
    },
    "sass" : {
      "version": "3.1.0",
      "regexp" : "s (.*?) "
    },
    "npm" : {
      "module" : "generator-pisco-recipe",
      "version" : "0.0.2"
    }    
  },
  [...]
}
```

This is the possible parameters that you need in order to define a system requirement.

- **key** (for example 'java'): is the command that you need inside your shot.
- **version**: (optional) is the minimum version that you need for the command.
- **option**: (optional, default is '-v') if version is set the way to check this version.
- **regexp**: (optional) if version is on a string the way to extract only the version.
- **module**: (optional) only with npm command. Check if a node_module is installed globally.
 
#### 2. Check if a pisco command has all system requirements satisfied

    cells component:validate --pstage check --b-syscheck --b-disablePrompts --b-disableContextCheck
    
Command explanation:

- **cells component:validate**: is the pisco command that you want to check.
- **--pstage check**: this means that only the check stage is executed for all the pipeline. System requirements check is a **pre-hook** of the stage **check** so you have to execute only this stage.
- **--b-syscheck**: tells pisco to check the system requirements. By default this check is not madden. (b- is the way to say pisco that this option is a Boolean, is the same of **--syscheck true**)
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

#### 3. Write the requirements into a global file 'requirements.json'

    cells component:validate --pstage check --b-saveRequirements --b-disablePrompts --b-disableContextCheck
    
Command explanation:

- **cells component:validate**: is the pisco command that you want to check.
- **--pstage check**: this means that only the check stage is executed for all the pipeline. System requirements check is a **pre-hook** of the stage **check** so you have to execute only this stage.
- **--b-saveRequirements**: tells pisco to save all system requirements in one file.
- **--b-disablePrompts**: disable all prompts for the command. 
- **--b-disableContextCheck**: disable context checks for commands that need one.

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

Testing plugin. NO FUNCTIONALITY.