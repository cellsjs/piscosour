# Lectura de parámetros desde un shot

Todos los parametros que recibimos en un shot están centralizados en **shot.runner.params**. A contiuación se enumeran los métodos disponibles para la introducción de parámetros en la ejecución de pisco o de sus recetas.

## (1) Opción en la línea de comando. 

    pisco --workingDir workspace

el parámetro shot.runner.params.workingDir="workspace"

## (2) Configuración en el fichero piscosour.json 

Este fichero puede estar:

- En el directorio .piscosour al mismo nivel desde donde se ejecuta el comando pisco.
- En la raiz de la receta

La definición de los parámetros incluye estos ámbitos (scopes):

**Común para todos los straws que se ejecuten y por consiguiente para todos los shots contenidos:**
    
```js
{
    "params": {
        "workingDir": "workspace"
    },
    
    [...]
}
``` 

**Común para todos los shots de un straw:** ("validate" es el nombre del straw)

```js
{
    [...]
    "straws" : {
        "validate" : {
            "params" : {
                "workingDir": "workspace"
            }
        }
    }
    [...]
}
``` 

**Común para todos los repoTypes de un shot:** ("install" es el nombre del shot)

```js
{
    [...]
    "shots" : {
        "install" : {
            "params" : {
                "workingDir": "workspace"
            }
        }
    }
    [...]
}
```
 
**Específico para un shot y para un repoType dado:** ("component" es el repoType) 

```js
{
    [...]
    "shots" : {
        "install" : {
            "component" : {
                "params" : {
                    "workingDir": "workspace"
                }
            }
        }
    }
    [...]
}
``` 

Todas estas opciones acabarán con el parámetro shot.runner.params.workingDir="workspace".

### Prioridad:

- **1** fichero .piscosour/piscosour.json al mismo nivel de la ejecución del comando.
    - **1.1** Específico para un shot y para un repoType dado.
    - **1.2** Común para todos los repoTypes de un shot.
    - **1.3** Común para todos los shots de un straw.
    - **1.4** Común para todos los straws.
- **2** piscosour.json de la receta.
    - (el mismo que el anterior) 

NOTA: En caso de estar definido varias veces un parámetro será sobre-escrito por el número más pequeño de esta lista.

## (3) Configuración en el fichero straw.json

Este fichero se encuentra en la receta en [recipeRoot]/straws/[recipeName]/straw.json

**Común para todos los shots del straw** 

```js
{
    "params": {
        "workingDir": "workspace"
    },
    "shots" : {
        [...]
    }
}
``` 

**Común para todos los repoTypes de un shot** ("install" es el nombre del shot)

```js
{
    "params": {},
    "shots" : {
        "install" : {
            "params" : {
                "workingDir": "workspace"
            }
        }
    }
}
```
 
**Específico para un shot y para un repoType dado** ("component" es el repoType) 

```js
{
    "params": {},
    "shots" : {
        "install" : {
            "component" : {
                "params" : {
                    "workingDir": "workspace"
                }
            }
        }
    }
}
``` 

Todas estas opciones acabarán con el parámetro shot.runner.params.workingDir="workspace".

### Prioridad:

- **1** Específico para un shot y para un repoType dado.
- **2** Común para todos los repoTypes de un shot.
- **3** Común para todos los shots de un straw.

NOTA: En caso de estar definido varias veces un parámetro será sobre-escrito por el número más pequeño de esta lista.

## (4) Configuración en el fichero params.json de un shot

Existen dos localizaciones para este fichero:

**Común para todos los repoTypes del shot** ("install" es el nombre del shot)

Este fichero se encuentra en la receta en [recipeRoot]/shots/[shotName]/params.json

```js
{
    "workingDir" : "workspace"
}
```

**Específico para un repoType dado** ("component" es el repoType)

Este fichero se encuentra en la receta en [recipeRoot]/shots/[shotName]/[repoType]/params.json

```js
{
    "workingDir" : "workspace"
}
```


El parámetro será shot.runner.params.workingDir="workspace".

### Prioridad:

- **1** Específico para un repoType dado.
- **2** Común para todos los repoTypes del shot.

NOTA: En caso de estar definido varias veces un parámetro será sobre-escrito por el número más pequeño de esta lista.

## (5) Pregunta al usuario interactivamente.

Para ello será necesario configurar el parámetro prompts en el fichero **params.json**. La definición de parámetros en el array de prompts usa el formato del módulo inquirer

[Documentación de inquirer](https://www.npmjs.com/package/inquirer)

Se han añadido dos parámetros más a la configuración de inquirer:
 
 - **env**: Nombre de la variable de entorno que se intentará usar para resolver este parámetro antes de preguntar al usuario de manera interactiva.
 - **required**: (true/false) Establece si el campo es obligatorio o no.

```js
  "prompts": [
    {
      "type": "input",
      "name": "workingDir",
      "required" : true,
      "message": "Where do you want to work?",
      "env" : "bamboo_WORKING_DIR",
      "value" : "valor fijo"
    }
  ]
```

### Asignar funciones a los parámetros check, validate y choices.

Dado que params.json es un fichero json y no está permitido escribir código javascript se ha habilitado una forma de asignar funciones propias del shot a los parámetros check, validate y choices de inquirer.

```js
  "prompts": [
    {
      "type": "input",
      "name": "workingDir",
      "required" : true,
      "message": "Where do you want to work?",
      "when" : "#workingDirFunction"
    }
  ]
```

mediante "#...nombre de la función" le decimos a piscosour que función tiene que ejecutar inquirer al cargar la variable. 

Ahora en el shot simplemente definimos:

```js
var shot = new Shot({
    description : "Adding shot to a straw",

    [...]

    workingDirFunction : function(answer){
        return answer.workingDir;
    },
    
    [...]
}
```

**answer** es el objeto completo con las respuestas del usuario.  

El parámetro será shot.runner.params.workingDir="workspace".
 
Creando la lista prompts en **params.json** automáticamente el shot preguntará al usuario siempre que el parámetro no venga informado.


### Prioridad:
 
 Si se usa más de un método para introducir un parámetro este será el orden de prioridad usado para estar disponible en **shot.runner.params**

- 1 - Parámetro por línea de comando.
- 2 - Variable de entorno especificada en el parámetro env del prompt.
- 3 - Configuración del fichero .piscosour/piscosour.json.
- 4 - Configuración del fichero piscosour.json de la receta.
- 5 - Configuración del fichero straw.json de la receta. ([recipeRoot]/straws/[recipeName]/straw.json)
- 6 - Configuración del fichero params.json de la receta. ([recipeRoot]/shots/[shotName]/[repoType]/params.json)
- 7 - valor del parámetro "value" dentro de un prompt.
- 8 - Pregunta al usuario si todas las enteriores no vienen informadas.

NOTA: En caso de estar definido varias veces un parámetro será sobre-escrito por el número más pequeño de esta lista.