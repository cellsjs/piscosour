# Instalación de piscosour

Instalar piscosour como un comando global. (-g) 

    npm install -g piscosour
     
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