[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

![Piscosour: Get all your devops tools wrapped-up!](doc/images/logo.png)

# ¿Qué es piscosour?

- Piscosour envuelve todas las herramientas de desarrollo por línea de comando (CLI), creando workflows comprobables ejecutados también por línea de comando.
- Piscosour no remplaza otras herramientas, coexiste con todas permitiendo el mejor aprovechamiento y simbiosis de todas ellas.
- Los shots son componentes sencillos y reutilizables mediante una simple dependencia npm.
- Cada ejecución de Piscosour genera un fichero junit.xml que posibilita la mejor integración con los orquestadores más populares de C.I. como Jenkins, Hudson, Bamboo, etc.
- Piscosour mantiene todos los sets de herramientas ordenados bajo la misma receta, así podrías tener recetas para polymer, angularjs, react, instalaciones, utilidades de sistema... y usarlos en cualquier workflow que necesites.

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


# Documentación

* [Get Started](doc/get_started.md) - Empieza a usar piscosour.
* [What is piscosour?](doc/what_is_piscosour.md) - ¿Qué es piscosour?
* [Plugins](doc/plugins.md) - Para escribir y usar plugins.
* [Introducción de parámetros](doc/Load_Parameters.md) - Obtener parámetros de configuración para la ejecución de tus shots.
* [Configuración de piscosour: piscosour.json](doc/configuration.md)

# HOWTOs

* [Cómo crear una receta](doc/get_started.md) - Manual para crear una receta desde cero.
* [Cómo transformar un módulo nodejs en receta](doc/convert_to_recipe.md) - Transformar un módulo nodejs cualquiera en una receta piscosour.
* [Trabajar con shots](doc/shots.md) - Crear un shot y usar el API para sacarle el 100% del partido a piscosour.
* [Trabajar con straws](doc/straws.md) - Crear un straw y configurarlo a partir de shots propios o de otras recetas.


