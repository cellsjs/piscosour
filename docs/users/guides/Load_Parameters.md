---
title: Load Parameters
layout: doc_page.html
order: 1
---

# Lectura de parámetros desde un step

Todos los parametros que recibimos en un step están centralizados en **this.params**. A contiuación se enumeran los métodos disponibles para la introducción de parámetros en la ejecución de pisco o de sus recetas.

## (1) Opción en la línea de comando.

    pisco --workingDir workspace --params1 value1 --params2 value2

el parámetro this.params.workingDir="workspace"

También es posible pasar como parámetro de línea de comando un fichero json con definiciones de parámetros más complejas: Objetos y Arrays.

    pisco --paramsFile params.json

Donde params.json será algo así:

```
{
  "workingDir": "workspace",
  "params1": "value1",
  "params2": "value2"
  "objParam": {
    "params3": "value3"
  },
  "arrayParam": [1,2,3]
 }
```

## (2) Configuración en el fichero piscosour.json

Este fichero puede estar:

- En el directorio .piscosour al mismo nivel desde donde se ejecuta el comando pisco.
- En la raiz de la receta

La definición de los parámetros incluye estos ámbitos (scopes):

**Común para todos los flows que se ejecuten y por consiguiente para todos los steps contenidos:**

```js
{
    "params": {
        "workingDir": "workspace"
    },

    [...]
}
```

**Común para todos los steps de un flow:** ("validate" es el nombre del flow)

```js
{
    [...]
    "flows" : {
        "validate" : {
            "params" : {
                "workingDir": "workspace"
            }
        }
    }
    [...]
}
```

**Común para todos los repoTypes de un step:** ("install" es el nombre del step)

```js
{
    [...]
    "steps" : {
        "install" : {
            "params" : {
                "workingDir": "workspace"
            }
        }
    }
    [...]
}
```

**Específico para un step y para un repoType dado:** ("component" es el repoType)

```js
{
    [...]
    "steps" : {
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

Todas estas opciones acabarán con el parámetro this.params.workingDir="workspace".

### Prioridad:

- **1** fichero .piscosour/piscosour.json al mismo nivel de la ejecución del comando.
    - **1.1** Específico para un step y para un repoType dado.
    - **1.2** Común para todos los repoTypes de un step.
    - **1.3** Común para todos los steps de un flow.
    - **1.4** Común para todos los flows.
- **2** piscosour.json de la receta.
    - (el mismo que el anterior)

NOTA: En caso de estar definido varias veces un parámetro será sobre-escrito por el número más pequeño de esta lista.

## (3) Configuración en el fichero flow.json

Este fichero se encuentra en la receta en [recipeRoot]/flows/[recipeName]/flow.json

**Común para todos los steps del flow**

```js
{
    "params": {
        "workingDir": "workspace"
    },
    "steps" : {
        [...]
    }
}
```

**Común para todos los repoTypes de un step** ("install" es el nombre del step)

```js
{
    "params": {},
    "steps" : {
        "install" : {
            "params" : {
                "workingDir": "workspace"
            }
        }
    }
}
```

**Específico para un step y para un repoType dado** ("component" es el repoType)

```js
{
    "params": {},
    "steps" : {
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

Todas estas opciones acabarán con el parámetro this.params.workingDir="workspace".

### Prioridad:

- **1** Específico para un step y para un repoType dado.
- **2** Común para todos los repoTypes de un step.
- **3** Común para todos los steps de un flow.

NOTA: En caso de estar definido varias veces un parámetro será sobre-escrito por el número más pequeño de esta lista.

## (4) Configuración en el fichero params.json de un step

Existen dos localizaciones para este fichero:

**Común para todos los repoTypes del step** ("install" es el nombre del step)

Este fichero se encuentra en la receta en [recipeRoot]/steps/[stepName]/params.json

```js
{
    "workingDir" : "workspace"
}
```

**Específico para un repoType dado** ("component" es el repoType)

Este fichero se encuentra en la receta en [recipeRoot]/steps/[stepName]/[repoType]/params.json

```js
{
    "workingDir" : "workspace"
}
```


El parámetro será this.params.workingDir="workspace".

### Prioridad:

- **1** Específico para un repoType dado.
- **2** Común para todos los repoTypes del step.

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

Dado que params.json es un fichero json y no está permitido escribir código javascript se ha habilitado una forma de asignar funciones propias del step a los parámetros check, validate y choices de inquirer.

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

Ahora en el step simplemente definimos:

```js
module.exports = {
    description : "Adding step to a flow",

    [...]

    workingDirFunction : function(answer){
        return answer.workingDir;
    },

    [...]
}
```

**answer** es el objeto completo con las respuestas del usuario.  

El parámetro será this.params.workingDir="workspace".

Creando la lista prompts en **params.json** automáticamente el step preguntará al usuario siempre que el parámetro no venga informado.


### Prioridad:

 Si se usa más de un método para introducir un parámetro este será el orden de prioridad usado para estar disponible en **this.params**

- 1 - Parámetro por línea de comando.
- 2 - Variable de entorno especificada en el parámetro env del prompt.
- 3 - Configuración del fichero .piscosour/piscosour.json.
- 4 - Configuración del fichero piscosour.json de la receta.
- 5 - Configuración del fichero flow.json de la receta. ([recipeRoot]/flows/[recipeName]/flow.json)
- 6 - Configuración del fichero params.json de la receta. ([recipeRoot]/steps/[stepName]/[repoType]/params.json)
- 7 - valor del parámetro "value" dentro de un prompt.
- 8 - Pregunta al usuario si todas las enteriores no vienen informadas.

NOTA: En caso de estar definido varias veces un parámetro será sobre-escrito por el número más pequeño de esta lista.
