# Guía del programador.

Piscosour es un generador de herramientas. Todas las herramientas generadas con piscosour tendrán una línea de comando propia. 
Piscosour maneja flujos de ejecución (straw), es decir, cada ejecución de pisco desencadena la ejecución de un número determinado de pasos (shots) que a su vez llevan a cabo su propio ciclo de vida (stages)  

- **stages (fases)** - Fases dentro de la ejecución de un paso (shot): (check, config, run, probe, notify).
- **shot (trago)** - Paso de ejecución. Los flujos (straws) están compuestos de la ejecución de varios shots. 
- **straw (pajita)** - Flujo de ejecución. Son una lista de pasos que son ejecutados uno detrás del otro o de menara paralela, dependiendo del tipo de straw.
- **repository (repositorios)** - Se trata de un repositorio Git. La unidad básica de software a tratar.
- **repository types (tipos de repositorio)** - Caracterizan una estructura de directorios, un lenguaje o el diseño de un componente software. podemos establecer todos los tipos de repositorios que creamos necesarios.
- **command (comandos)** - Sirven para ejecutar un flujo determinado para un tipo de repositorio. [repoType]:[straw]:(opcional)[shot] 

## recipe (receta)

- Es un módulo nodejs que contiene como mínimo un ejecutable './bin/pisco.js' y un fichero 'piscosour.json' de configuración.  
- La receta es un contenedor de straws y shots.
- Una receta puede contener en su package.json otras recetas que automáticamente pondrán a disposición de la receta madre todos sus shots y straws (y por lo tanto comandos también) 


# Sample shot.js

```js
'use strict';

var piscosour = require('piscosour'),
    Shot = piscosour.Shot;

var shot = new Shot({
    description : "Brief description of shot",

    check : function(){
        shot.logger.info("#magenta","check","Check all pre-requisites for the execution");
    },

    config : function(){
        shot.logger.info("#magenta","config","Preparing params for main execution");
    },

    run : function(){
        shot.logger.info("#magenta","run","Run main execution");
    },

    prove : function(){
        shot.logger.info("#magenta","prove","Prove that the run execution was ok");
    },

    notify : function(){
        shot.logger.info("#magenta","notify","Recollect all execution information and notify");
    }

});

module.exports = shot;
```

# Params loading

all the params are loaded into the shot.runner.params object

Priority order

- **(1)** command params (--[param] [value])
- **(2)** local config
    - **(2.1)** prompt - env
    - **(2.2)** straw
    - **(2.3)** shot
    - **(2.4)** prompt (value ,default)
- **(3)** recipe config
    - **(3.1)** prompt - env
    - **(3.2)** straw
    - **(3.3)** shot
    - **(3.4)** prompt (value, default)
