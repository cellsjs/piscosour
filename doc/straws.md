# Trabajar con straws

Los straws son los flujos de ejecución dentro de pisco, equivalen a un comando. Un Straw no sabe nada del repoType, por lo tanto los straws se pueden usar con distintos repoType simplemente implementando todos los shots que integran dicho straw.
Los straws son simplemente ficheros json de configuración.

```js
{
  "type": "normal",
  "name": "Create from scratch",
  "description": "Starting a repository from scratch",
  "params" : {},
  "shots" : {
    "environment" : {
      "type": "straw"
    },
    "scaffolding" : {}
  }
}
```

**type**:

El type puede ser:

1. "normal": Aparecerá en el listado de comandos normales. (ejecutando la ayuda de la receta)
2. "internal": No aparece en el listado de comandos. Se usan para propositos internos dentro de otras straws. (en nuestro ejemplo environment es una straw internal)

**params**:

Serán los parámetros pasados a todos los shots de esa straw.

**name**, **description**:

Describen el straw serán las descripciones que aparecerán en el log cuando ejecutemos el straw.

**shots**:

Es un objeto con los shots que se van a ejecutar secuencialmente cuando ejecutemos el straw. Está en formato clave:valor la clave será el nombre del shot y el valor es un objeto que podrá contener los parámetros concretos que recive el shot en esa ejecución.

```
[...]
  "shots" : {
    "environment" : {
      "type": "straw",
      "params" {
        "clave" : "valor"
      }
    },
    "scaffolding" : {}
[...]
```

**NOTA:** No es conveniente usar los params dentro de una straw. Solo usar este supuesto en el caso de que queramos ejecutar un shot con un valor de un parámetro concreto. [más información sobre parámetros](Load_Parameters.md)

El type puede ser "straw" o "shot" si no se pone nada es de tipo "shot".


## Shots repetidos

En algunos casos puede ser necesario hacer uso del mismo shot en varias ocasiones (pero con distintas parametrizaciones). Para estos casos es necesario diferenciar el shot con un sufijo, separado por ':', de la siguiente forma *"myshot:suffix"*.

Ejemplo:

```
[...]
  "shots": {
    "myshot:first": {
      "params" {
        "key": "value1"
      }
    },
    "myshot:second": {
      "params"{
        "key": "value2"
      }
    }
  }
[...]
```

En el ejemplo hemos repetido el shot 'myshot' dos veces, y hemos diferenciado los dos shots con los siguientes sufijos ":first", y ":second".

Se recomienda que el nombre del sufijo sea descriptivo y que indique en que lo diferencia.


## Comunicación entre shots

Los shots pueden emitir y recibir información información de otros shots. En el straw se puede configurar qué parámetros se reciben de otros shots.

Ejemplo:

```
[...]
  "shots": {
    "myshot1": { },
    "myshot2": {
      "input"{
        "key": { "myshot1" : "value" }
      }
    }
  }
[...]
```

En este caso, myshot2 recibe el parametro key a partir de myshot1.

Más información en [Parameters transmition between shots](Parameters_between_shots.md)


