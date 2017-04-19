---
title: Configuration
layout: doc_page.html
order: 2
---

# El fichero de configuración piscosour.json

Este fichero se encuentra en la raiz de todas las recetas y configura todos los aspectos de la aplicación. La configuración es heredada por todas las recetas importada como paquete dentro de una receta.

**La configuración efectiva es la mezcla de todas las configuraciones de todas las recetas**

(se puede consultar la configuración efectiva de pisco ejecutando pisco -ov)

El módulo Piscosour tiene un fichero de configuración más completo, que podrá ser sobreescrito por cualquier receta. El orden de prioridad en la carga de la configuración es el establecido en el articulo: [Introducción de parámetros](Load_Parameters.md)


Este es el aspecto de piscosour.json del modulo piscosour

```js
{
  "cmd" : "pisco",
  "params" : {
    "plugins" : ["inquirer"]
  },
  "repoTypes": [
    "recipe"
  ],
  "defaultType": "recipe",
  "junitDir": "test-reports",
  "junitPiscoFile": "pisco-junit.xml",
  "stages": [
    "check",
    "config",
    "run",
    "prove",
    "notify"
  ],
  "flowTypes": [
    "normal",
    "parallel",
    "utils",
    "internal"
  ]
}
```

Las recetas solo deberán informar de la configuración que quieran añadir o sobreescribir. Este es el fichero piscosour.json tipo de una receta:

```js
{
    "cmd": "cells",
    "repoTypes": [
        "component"
    ],
    "defaultType": "component"
}
```

# Explicación de cada parámetro


- **cmd**: Es el comando utilizado para la ejecución de la receta cuando esta está instalada globalmente.
- **params**: Son los parámetros globales pasados a todos los flows y steps de una receta. En nuestro ejemplo está definido un plugin a nivel global, este plugin será añadido en todos los steps de todas las recetas de pisco. [Introducción de parámetros](Load_Parameters.md)
- **repoTypes**: Definición de los tipos de repositorio que soporta nuestra receta.
- **defaultType**: Tipo de repositorio por defecto. Será el usado para la ejecución de comandos sin especificar tipo de repositorio.

Si ejecutas

    pisco create

es como si estuviera ejecutando

    pisco recipe:create

sin embarcon en el ejemplo de abajo

    cells create

sería:

    cells component:create

- **junitDir**: Directorio donde se grabará el fichero junit.xml
- **junitPiscoFile**: nombre del fichero junit.xml que se generará cuando se ejecute pisco con "-u".
- **stages**: Fases que recorrerán todos los steps de la receta. Estas fases serán llamadas en todos los steps si corresponden con functions. Se pueden añadir más fases a las preestablecidas en el fichero raiz de pisco. **Nunca eliminar**
Actualmente son :  "check",  "config",  "run", "prove", "notify"

notese que corresponden con los métodos a implementar dentro de un step:

```js
    check : function(){
        this.logger.info("#magenta","check","Check all pre-requisites for the execution");
    },

    config : function(){
        this.logger.info("#magenta","config","Preparing params for main execution");
    },

    run : function(){
        this.logger.info("#magenta","run","Run main execution");
    },

    prove : function(){
        this.logger.info("#magenta","prove","Prove that the run execution was ok");
    },

    notify : function(){
        this.logger.info("#magenta","notify","Recollect all execution information and notify");
    }
```

si en un fichero piscosour.json se añade otra fase está será llamada si el step la tiene implementado. Por ejemplo:

```js
[...]
 "stages": ["final"]
[...]
```

será llamada después de la ultima fase notify.

```js
[...]
    final : function(){
        this.logger.info("#magenta","notify","Recollect all execution information and notify");
    }
[...]
```


- **flowTypes**:

        "normal",
        "utils",
        "internal"
