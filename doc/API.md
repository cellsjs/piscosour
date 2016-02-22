# Definición de conceptos

Piscosour es un generador de herramientas. Todas las herramientas generadas con piscosour tendrán una línea de comando propia. 
Piscosour maneja flujos de ejecución (straw), es decir, cada ejecución de pisco desencadena la ejecución de un número determinado de pasos (shots) que a su vez llevan a cabo su propio ciclo de vida (stages)  

- **stages (fases)** - Fases dentro de la ejecución de un paso (shot): (check, config, run, probe, notify).
- **shot (trago)** - Paso de ejecución. Los flujos (straws) están compuestos de la ejecución de varios shots. 
- **straw (pajita)** - Flujo de ejecución. Son una lista de pasos que son ejecutados uno detrás del otro o de menara paralela, dependiendo del tipo de straw.
- **repository (repositorios)** - Se trata de un repositorio Git. La unidad básica de software a tratar.
- **repository types (tipos de repositorio)** - Caracterizan una estructura de directorios, un lenguaje o el diseño de un componente software. podemos establecer todos los tipos de repositorios que creamos necesarios.
- **command (comandos)** - Sirven para ejecutar un flujo determinado para un tipo de repositorio. [repoType]:[straw]:(opcional)[shot] 
- **Recipe (receta)**:
    - Es un módulo nodejs que contiene como mínimo un ejecutable './bin/pisco.js' y un fichero 'piscosour.json' de configuración.  
    - La receta es un contenedor de straws y shots.
    - Una receta puede contener en su package.json otras recetas que automáticamente pondrán a disposición de la receta madre todos sus shots y straws (y por lo tanto comandos también) 

# Estructura de directorios
## Definición de un shot
## Definición de un straw

# Fichero de configuración: piscosour.json

# Lectura de parámetros del usuario en un shot

Todos los parametros que recibimos en un shot están centralizados en **shot.runner.params**.

## Métodos de introducción de parámetros

**(1)** Opciones en la línea de comando. 

    pisco --workingDir workspace

el parámetro shot.runner.params.workingDir="workspace"

**(2)** Pregunta interactiva al usuario

Para ello será necesario configurar el parámetro prompts en el fichero **params.json**
 
 

**(2)** Archivo de configuración en el directorio de ejecución: ./piscosour/piscosour.json

```
{
  "shots": {
    "check-out": {
      "component": {
        "params": {
          "workingDir": "workspace"
        }
      }
    }
  }
}
```

el parámetro shot.runner.params.workingDir="workspace"

## Orden de prioridad: 

- **(1)** opciones de comando (pisco --[param] [value]) Opciones pasadas en la línea de comando.
- **(2)** local config (.piscosour/piscosour.json en el directorio donde se está ejecutando el comando, normalmente es la raiz de un repositorio git)
    - **(2.1)** prompt - env
    - **(2.2)** straw
    - **(2.3)** shot
    - **(2.4)** prompt (value ,default)
- **(3)** recipe config (piscosour.json de la receta)
    - **(3.1)** prompt - env
    - **(3.2)** straw
    - **(3.3)** shot
    - **(3.4)** prompt (value, default)
