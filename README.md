# Documentation

* [Complete documentation](doc/README.md) - Complete documentation, howtos, api, examples...

# Installing piscosour

Install piscosour globally

    npm install -g piscosour


# Recipes


|Name|Version|Description|
|---|---|---|
|piscosour|0.3.1|Get all your devops tools wrapped-up!|



# Commands


 **from piscosour  v.0.3.1:**

- **pisco recipe:config** ( Manage a piscosour recipe )
- **pisco recipe:convert** ( Convert any module into a piscosour recipe )
- **pisco recipe:create** ( Starting a repository from scratch )
- **pisco recipe:docs** ( Generate documentation for straws and shots )
- **pisco recipe::convert** ( Convert any nodejs module into a piscosour recipe )
- **pisco default::generate-docs** ( Generate one file per straw inside a directory )
- **pisco default::npm** ( Checking all npm commands needed )
- **pisco recipe::piscosour** ( Configure piscosour.json )
- **pisco recipe::scaffolding** ( Create a piscosour recipe from a scaffold template )
- **pisco recipe::shots** ( Create new pisco shot inside this module )
- **pisco recipe::straws** ( Adding shot to a straw )



##config: "Configure one repository"
Manage a piscosour recipe


### 1. piscosour: "Configure piscosour.json"
```
Repository types:  recipe
Recipes: piscosour (0.3.1)
```
shot piscosour


### 2. shots: "Create new pisco shot inside this module"
```
Repository types:  recipe
Recipes: piscosour (0.3.1)
```
shot shots


### 3. straws: "Adding shot to a straw"
```
Repository types:  recipe
Recipes: piscosour (0.3.1)
```
shot straws

##convert: "Module to recipe"
Convert any module into a piscosour recipe


### 1. convert: "Convert any nodejs module into a piscosour recipe"
```
Repository types:  recipe
Recipes: piscosour (0.3.1)
```
shot convert

##create: "Create from scratch"
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
### 1. (Straw) environment: "Environment Checks"
Checks and install if an environment is ok


### 1.1. npm: "Checking all npm commands needed"
```
Repository types:  all
Recipes: piscosour (0.3.1)
```
shot npm


### 2. scaffolding: "Create a piscosour recipe from a scaffold template"
```
Repository types:  recipe
Recipes: piscosour (0.3.1)
```
shot scaffolding

##docs: "Generate Documentation"
Generate documentation for straws and shots
Command: **bin/pisco.js docs**

Generate documentation for your recipe.

### How to write info.md

Info.md is a regular md file, so you can use all the markdown specification. The only thing that you have to be on mind is the use of titles. 
 
**Inside a info.md use title from third level and beyond**

### 1. generate-docs: "Generate one file per straw inside a directory"
```
Repository types:  all
Recipes: piscosour (0.3.1)
```
shot generate-docs


# Plugins


## cookbook

This plugins provide functionality  
## fsutils

Plugins with some fs utilities
## inquirer

Utility for inquire the user
## launcher


## piscosour


## test

