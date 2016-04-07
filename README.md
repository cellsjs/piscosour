[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

![Piscosour: Get all your devops tools wrapped-up!](doc/images/logo.png)

# ¿Qué es piscosour?

- Piscosour envuelve todas las herramientas de desarrollo por línea de comando (CLI), creando workflows comprobables ejecutados también por línea de comando.
- Piscosour no remplaza otras herramientas, coexiste con todas permitiendo el mejor aprovechamiento y simbiosis de todas ellas.
- Los shots son componentes sencillos y reutilizables mediante una simple dependencia npm.
- Cada ejecución de Piscosour genera un fichero junit.xml que posibilita la mejor integración con los orquestadores más populares de C.I. como Jenkins, Hudson, Bamboo, etc.
- Piscosour mantiene todos los sets de herramientas ordenados bajo la misma receta, así podrías tener recetas para polymer, angularjs, react, instalaciones, utilidades de sistema... y usarlos en cualquier workflow que necesites.

El concepto de componente llega al mundo de las herramientas de construcción, pruebas, integración y entrega continua.
Piscosour envuelve la funcionalidad de cualquier herramienta y permite ...

- **Localizar fácilmente**
- **Documentar**
- **Compartir**
- **Confiar**
- **Versionar**
- **Controlar el flujo de vida**
- **Controlar resultados**

... de todos esos scripts bash, tareas gulp, grunt, generadores de yeoman, hydrolysis, lint, eslint, herramientas de polymer. etc. que tengas por ahí.
 
Para hacerte a una idea, es un **jenkins**, un **bamboo**, **gocd** o **travis** por línea de comando, que permite mejor reutilización de flujos. Piscosour no sustituye otras herramientas, convive con todas ellas y permite la mejor simbiosis de todas ellas.  

**"Usa todas tus herramientas favoritas pero mantenlas controladas y versionadas."**

# Documentación

* [Get Started](doc/get_started.md) - Empieza a usar piscosour.
* [What is piscosour?](doc/what_is_piscosour.md) - ¿Qué es piscosour?
* [Plugins](doc/plugins.md) - Para escribir y usar plugins.
* [Introducción de parámetros](doc/Load_Parameters.md) - Obtener parámetros de configuración para la ejecución de tus shots.
* [Configuración de piscosour: piscosour.json](doc/configuration.md)

# HOWTOs

* [Migración a la versión 0.2.0 desde 0.1.0](doc/0.2.0_migration_guide.md) - Migrar recetas de la versión 0.1.0 a la 0.2.0.
* [Cómo crear una receta](doc/get_started.md) - Manual para crear una receta desde cero.
* [Cómo transformar un módulo nodejs en receta](doc/convert_to_recipe.md) - Transformar un módulo nodejs cualquiera en una receta piscosour.
* [Trabajar con shots](doc/shots.md) - Crear un shot y usar el API para sacarle el 100% del partido a piscosour.
* [Trabajar con straws](doc/straws.md) - Crear un straw y configurarlo a partir de shots propios o de otras recetas.

#Recipes

|Name|Version|Description|
|---|---|---|
|piscosour|0.3.0|Get all your devops tools wrapped-up!|



# Commands


##config: "Configure one repository"
Manage a piscosour recipe


### 1. piscosour: "Configure piscosour.json"
```
Repository types:  recipe
Recipes: piscosour (0.3.0)
```
shot piscosour


### 2. shots: "Create new pisco shot inside this module"
```
Repository types:  recipe
Recipes: piscosour (0.3.0)
```
shot shots


### 3. straws: "Adding shot to a straw"
```
Repository types:  recipe
Recipes: piscosour (0.3.0)
```
shot straws

##convert: "Module to recipe"
Convert any module into a piscosour recipe


### 1. convert: "Convert any nodejs module into a piscosour recipe"
```
Repository types:  recipe
Recipes: piscosour (0.3.0)
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
Recipes: piscosour (0.3.0)
```
shot npm


### 2. scaffolding: "Create a piscosour recipe from a scaffold template"
```
Repository types:  recipe
Recipes: piscosour (0.3.0)
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
Repository types:  recipe
Recipes: piscosour (0.3.0)
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

