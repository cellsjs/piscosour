##piscosour

repositoryType in recipe, default

##shot

Un shot es un paso de un straw que tiene un ciclo de vida definido por el atributo stages que está contenido en piscosour.json, no tiene por que implementar todos los métodos de stages.

Un shot puede crear con el comando pisco config o de forma manual

El ejemplo mínimo de shot es:

```js
'use strict';

var piscosour = require('piscosour'),
   Shot = piscosour.Shot;

var shot = new Shot({
   description : "Brief description of shot",

   check : function(){
       shot.logger.info("#magenta","check","Check all pre-requisites for the execution");
   }

});

module.exports = shot;

```
Cada método de un shot, recibe dos funciones (resolve, reject), 
* si no se llama a ninguna, se llama automaticamente la función resolve
* si no quieres que se llame automaticamente la función resolve por que estás haciendo cosas asincronas, debes devolver un true al final de la función y la responsabilidad de ejecutar resolve o reject es del programador del shot.

Se pueden definir métodos y variables en un shot que no estén declarados como stage, para poder hacerlo, se crean como un stage normal y se acceden con shot.runner.[method]

Tienes disponible el objeto params.json en shot.runner.params

Hay disponible un global storage 
* shot.save(clave, valor) almacena una variable y la asocia al paso 
* shot.get(clave, shotname)

variables globales
paso de variables entre shots

El orden y la configuración de los diferentes straw, se almacena en straw.json componente/straws/[strawName]/straw.json

##recipe:  
receta de pisco, tipo de repositorio que tiene piscosour de dependencia y añade como keyword piscosour
tiene además piscosour.json
    
default: 
Cuando la acción que voy a ejecutar no depende del tipo de repositorio

### piscosour.json

archivo de configuración de una receta de pisco, estos valores de archivo serán sobre-escritos por el json de la receta

cmd nombre del comando que se usa para ejecutar la receta desde la linea de comandos

repoTypes: tipo de repositorios que trata tu receta

defaultType: Si no se especifica un recipetype cuando se ejecuta el comando de la receta, se usará este valor por defecto

junitDir: carpeta en la que se almacenan los archivos resultantes de los tests

stages: serán métodos que tienen que tener implementados opcionalmente los shots de esta receta, se ejecutarán en el orden en el que estén incluidos para todos los shots de la receta

strawTypes: 
normal: en cascada
parallel: not implemented yet
utils: to be refactored
internal: to be refactored

straws: se configuran con pisco config y contiene el listado de straws de la receta, se corresponde con la carpeta $RECIPE_HOME/straws

la lista de straws está definida por un array asociativo cuya clave es el nombre del straw y cuyo valor a su vez es un array asociativo con los siguientes valores:

type: strawtype
name: nombre de la receta
description: descripción de la receta

esta información sirve para mostrar información cuando se ejecuta pisco



##posibles mejoras

### cambio en el comando
Si tenemos una receta que contenga estos atributos

repositoryType=component
straw=validate
shots=lint,coverage,demo

ahora mismo si quiero ejecutar un shot, debería usar:

cmd -s component:lint

como usuario de pisco, me gustaría poder ejecutar pisco de la siguiente forma

pisco component:validate:lint

### inyección de dependencias

como usuario, me gustaría que la creación de un shot no fuera mediante parámetros sino por inyección de dependencias
https://es.wikipedia.org/wiki/Inyecci%C3%B3n_de_dependencias

### global storage

como usuario quiero que el shot.get me devuelva un valor y que si hay dos pasos que son iguales no se sobreescriban los valores
