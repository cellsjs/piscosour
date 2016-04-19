[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

![Piscosour: Get all your devops tools wrapped-up!](doc/images/logo.png)

# Documentation

* [Complete documentation](doc/README.md) - Complete documentation, howtos, api, examples...

# Installing piscosour

Install piscosour globally

    npm install -g piscosour


# Recipes


|Name|Version|Description|
|---|---|---|
|piscosour|0.4.0|Get all your devops tools wrapped-up!|



# Commands



**from piscosour  v.0.4.0:**

- **pisco node-module::convert** ( Convert any nodejs module into a piscosour recipe )
- **pisco recipe::generate-docs** ( Generate one file per straw inside a directory )
- **pisco all::npm** ( Checking all npm commands needed )
- **pisco recipe::piscosour** ( Configure piscosour.json )
- **pisco recipe::scaffolding** ( Create a piscosour recipe from a scaffold template )
- **pisco recipe::shots** ( Create new pisco shot inside this module )
- **pisco recipe::straws** ( Adding shot to a straw )
- **pisco recipe:add-shot** ( Add a shot to a piscosour recipe )
- **pisco recipe:add-straw** ( Add a straw to a piscosour recipe )
- **pisco recipe:config** ( Manage a piscosour recipe )
- **pisco node-module:convert** ( Convert any module into a piscosour recipe )
- **pisco recipe:create** ( Starting a repository from scratch )
- **pisco recipe:docs** ( Append documentation from info.md to readme.md of the recipe )



## add-shot: "Add a shot"
Add a shot to a piscosour recipe


### 1. shots: "Create new pisco shot inside this module"
```
Repository types:  recipe
Recipes: piscosour (0.4.0)
```
shot shots

## add-straw: "Add straw"
Add a straw to a piscosour recipe


### 1. straws: "Adding shot to a straw"
```
Repository types:  recipe
Recipes: piscosour (0.4.0)
```
shot straws

## config: "Configure piscosour"
Manage a piscosour recipe


### 1. piscosour: "Configure piscosour.json"
```
Repository types:  recipe
Recipes: piscosour (0.4.0)
```
shot piscosour

## convert: "Module to recipe"
Convert any module into a piscosour recipe


### 1. convert: "Convert any nodejs module into a piscosour recipe"
```
Repository types:  node-module
Recipes: piscosour (0.4.0)
```
shot convert

## create: "Create from scratch"
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
## # 1. (Straw) environment: "Environment Checks"
Checks and install if an environment is ok


### 1.1. npm: "Checking all npm commands needed"
```
Repository types:  all
Recipes: piscosour (0.4.0)
```
shot npm


### 2. scaffolding: "Create a piscosour recipe from a scaffold template"
```
Repository types:  recipe
Recipes: piscosour (0.4.0)
```
shot scaffolding

## docs: "Generate Documentation"
Append documentation from info.md to readme.md of the recipe
Command: **bin/pisco.js docs**

Generate documentation for your recipe.

### How to write info.md

Info.md is a regular md file, so you can use all the markdown specification. The only thing that you have to be on mind is the use of titles. 
 
**Inside a info.md use title from third level and beyond**

### 1. generate-docs: "Generate one file per straw inside a directory"
```
Repository types:  recipe
Recipes: piscosour (0.4.0)
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

Actually by default the behaviour is asum that the repoType of the shot is necesary for the execution of the shot, if you need to execute one shot without check if the context is ok use contextFree. contextFree usually is use for shot like create or something like that.  

```
{
 [...]
  "contextFree" : true
}
```

#### addon: this.ctxIs

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

Plugins with some fs utilities
## inquirer

Utility for inquire the user
## launcher


## os

Plugins used to check Operating System where pisco is running
## piscosour


## test

