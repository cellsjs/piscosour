# ¿Qué es un plugin de pisco?

Es un prototipo que sirve para compartir funcionalidad de manera transversal entre shots y straws. El prototipo plugin actúa de dos maneras claramente diferenciadas.
 
 1. Como hook (o interceptor previo) en cada una de las fases del shot donde esté configurado.
 2. Como repositorio de addons (métodos añadidos al prototipo shot) que añaden funcionalidad al objeto shot de manera transparente.
 
este es el especto de un plugin tipo:

```js
'use strict';

var piscosour = require('piscosour');

var plug = new piscosour.Plugin({
    description : "Test plugin",

    // ---- HOOKS ----

    check : function(shot){
        this.logger.info("---------PLUGIN TEST--------");
        shot.test_pluginAddon("Ejemplo");
    },
    
    // ---- ADDONS ----

    addons : {

        test_pluginAddon: function (message) {
            this.logger.info("Test addon executed", name);
        }
    }
});

module.exports = plug;
```

## HOOKS
 - Los hooks reciben como parámetro el shot donde están actuando. Este shot será una referencia a la instancia shot que se está ejecutando en ese momento, por lo tanto con todas las propiedades y funciones del shot.
 - Las functions de los hooks deberán tener el mismo nombre que la fase (stage) que van a preceder. 
 - Deberán devolver una Promesa o undefined. No está permitido hacer return de otro tipo de valor.
    
## ADDONS
 - Los addons son métodos que se añaden al prototipo Shot por lo tanto van a poderse ejecutar desde cualquier referencia a este prototipo.
 - Dentro de una función addon **this** hace referencia al shot donde se está ejecutando, será una referencia a la instancia ejecutandose en ese momento con todo completamente cargado.
 - **ATENCIÓN: Los plugins añaden funciones al prototype Shot**. Para no sobreescribir funciones sensibles de Shot utilizar uno de estos dos métodos:
  
  1. Prefijar las funciones añadidas con el nombre del plugin + '_'. En nuestro ejemplo será **test_**.
  2. Crear un espacio de nombres: Esta solución pierde la referencia al **this** del propio shot y habría que pasar el shot al llamar a la función. En nuestro ejemplo:
  
  **plugin.js:**
  
```js
'use strict';

var piscosour = require('piscosour');

var plug = new piscosour.Plugin({
    description : "Test plugin",

    // ---- HOOKS ----

    check : function(shot){
        this.logger.info("---------PLUGIN TEST--------");
        shot.test.pluginAddon(shot,"Ejemplo");
    },
    
    // ---- ADDONS ----

    addons : {
        test : {
            pluginAddon: function (shot,message) {
                this.logger.info("Test addon executed", name);
            }
        }
    }
});

module.exports = plug;
```


# ¿Cómo crear un plugin?

Los plugins se pueden crear en cualquier receta y podrán ser usados desde cualquier receta que importe esta receta. Crear un plugin es tan simple como:

1. Crear una carpeta plugins en la raíz de tu receta.
2. Crear una carpeta con el nombre que le queremos dar al plugin.
3. Crear un fichero llamado **plugin.js** dentro de esta carpeta con el contenido inidicado más arriba. Es conveniente añadir un fichero info.md con la documentación específica del plugin. 
4. Listo! ya tienes tu plugin creado!

Es aconsejable crear plugins en recetas separadas, es decir, crear una receta unicamente con un plugin o varios relacionados dentro con el fin de hacer una mejor gestión de las dependencias que estos plugins necesiten.

# ¿Cómo usar un plugin?

Usar un plugin es muy sencillo, sigue estos pasos:

1. Si el plugin no está en tu receta importa el paquete npm de la receta donde se encuentre el plugin.
    
    npm install mis-plugins --save
    
2. Define el nombre del plugin en cualquiera de los "scopes" pisco piscosour.json, straw.json, params.json [Ver definición de parámetros](Load_Parameters.md).

en el caso de piscosour.json y straw.json

```js
[....]
  "params" : {
    "plugins" : ["test"]
  },
[....]
```

en el caso de params.json

```js
{
    "plugins" : ["test"]
}
```

3. Listo!. El plugin ejecutará todos los hooks que tenga asociados y el shot tendrá disponible todos los addons que se hayan definido.
 
 En nuestro ejemplo este sería el código del shot que usa el plugin test:
 
```js
 'use strict';
 
 var piscosour = require('piscosour'),
     Shot = piscosour.Shot;
 
 module.exports = {
     description : "Plugins test shot",

     config : function(resolve){
         this.logger.info("#magenta","config","Preparing params for main execution");
     },
 
     run : function(resolve){
         this.logger.info("#magenta","run","Run main execution");
         shot.test_pluginAddon("our example!!");
     },
 
     prove : function(resolve){
         this.logger.info("#magenta","prove","Prove that the run execution was ok");
     },
 
     notify : function(resolve){
         this.logger.info("#magenta","notify","Recollect all execution information and notify");
     } 
 });
 
 
```

Al ejecutar el shot aparecerá nuesto mensaje:

![First plugin execution](images/plugins1.png)
