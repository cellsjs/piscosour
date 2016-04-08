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
      "type": "straw"
      "params" {
        "clave" : "valor"
      }
    },
    "scaffolding" : {}
[...]
```
**NOTA:** No es conveniente usar los params dentro de una straw. Solo usar este supuesto en el caso de que queramos ejecutar un shot con un valor de un parámetro concreto. [más información sobre parámetros](Load_Parameters.md)

El type puede ser "straw" o "shot" si no se pone nada es de tipo "shot"
