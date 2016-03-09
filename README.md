[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

![Piscosour: Get all your devops tools wrapped-up!](doc/images/logo.png)

# ¿Qué es piscosour?

El concepto de componente llega al mundo de las herramientas de construcción, pruebas, integración y entrega continua.
Piscosour envuelve la funcionalidad de cualquier herramienta y permite ...

- **Localizar fácilmente**
- **Documentar**
- **Compartir**
- **Confiar**
- **Versionar**
- **Controlar el flujo de vida**
- **Controlar resultados**

... de todos esos scripts bash, tareas gulp, grunt, generadores de yeoman, hydrolysis, lint, eslint, herramientas de polymer. etc. que tengas por ahí.
 
Para hacerte a una idea, es un **jenkins**, un **bamboo**, **gocd** o **travis** por línea de comando, que permite mejor reutilización de flujos. Piscosour no sustituye otras herramientas, convive con todas ellas y permite la mejor simbiosis de todas ellas.  

**"Usa todas tus herramientas favoritas pero mantenlas controladas y versionadas."**

- Los shots de piscosour son componentes fácilmente reutilizables a partir de una simple dependencia npm.
- Piscosour envuelve la ejecución de otras herramientas creando flujos de trabajo en línea de comando. Generar un nuevo ejecutable es fácil con piscosour.    
- La ejecución de piscosour genera un fichero junit xml fácilmente interpretado por los orquestadores más extendidos de integración continua Jenkins, Hudson, Bamboo, Go...   

# Documentación

* [Get Started](doc/get_started.md) - Empieza a usar piscosour.
* [What is piscosour?](doc/what_is_piscosour.md) - ¿Qué es piscosour?
* [Manual de Usuario](doc/CLI.md) - Manual de usuario de piscosour.
* [Introducción de parámetros](doc/Load_Parameters.md) - Obtener parámetros de configuración para la ejecución de tus shots.
* [Configuración de piscosour: piscosour.json](doc/API.md)

# HOWTOs

* [Cómo crear una receta](doc/API.md) - Manual para crear una receta desde cero.
* [Cómo transformar un módulo nodejs en receta](doc/API.md) - Transformar un módulo nodejs cualquiera en una receta piscosour.
* [Cómo crear un shot](doc/API.md) - Crear un shot y usar el API para sacarle el 100% del partido a piscosour.
* [Cómo crear un straw](doc/API.md) - Crear un straw y configurarlo a partir de shots propios o de otras recetas.


