
#Command: ( config ): Configure one repository
Manage a piscosour recipe

##1. piscosour

shot piscosour

##2. shots

shot shots

##3. straws

shot straws

#Command: ( convert ): Module to recipe
Convert any module into a piscosour recipe

##1. convert

shot convert

#Command: ( create ): Create from scratch
Starting a repository from scratch

- Pisco te preguntará por el nombre de la receta que quieres crear. Este será el nombre de tu paquete npm que usarás para compartir la funcionalidad y las herramientas que envuelvas. Introduce el nombre que más te guste.
- Deberás introducir el comando que quieres usar para hacer correr los "straws" (flujos) que vas a introducir en este módulo.
- También deberás introducir una breve descripción para tu módulo.

Mientras pisco genera tu primera receta usando un generator de yeoman. Te explicamos brevemente lo que está pasando ante tus ojos. (no te preocupes, más adelante podrás profundizar más). 

"Pisco create" también es un comando envuelto de pisco que está ejecutando otras herramientas. Cada uno de los mensajes que ves aparecer es la ejecución de un shot (paso). Concretamente este comando conlleva la ejecución de estos pasos.

- system: Comprueba que tu sistema es compatible con la ejecución de piscosour
- npm: Comprueba que tienes instalado todos los módulos npm necesarios (yeoman y el generator-pisco-recipe)
- scaffolding: Hace las preguntas y llama a yeoman para generar el esqueleto del módulo.

Listo! ya tienes tu primer ejecutable de pisco creado! pruebalo
##1. scaffolding

shot scaffolding

#Command: ( docs ): Generate Documentation
Generate documentation for straws and shots

##1. generate-docs

shot generate-docs

#Command: ( environment ): Environment Checks
Checks and install if an environment is ok

Generate the environment for a repository
##1. system

shot system

##2. npm

shot npm

#Command: ( test ): Mock test
Testing for piscosour

##1. test2

shot test2

#Command: ( testint ): test
test

##1. test3

shot test3
