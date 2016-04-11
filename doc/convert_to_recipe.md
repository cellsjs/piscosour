# ¿Por qué convertir un módudo node a pisco?

Sencillo. Para poder crear un shot separado e independiente importarlo en cualquier otra receta y usarlo en un straw.


# Cómo convertir cualquier módulo node en una receta pisco.

Es muy sencillo. Simplemente ve a la raiz de tu módulo nodejs y ejecuta pisco convert.

    cd mymodule
    pisco convert
    
te preguntará el nombre del comando usado para ejecutar la receta. p.ej. test-convert

![Questions to convert a recipe](images/convert1.png)

Listo! Ya tienes tu nueva receta pisco. pruebala!

    node bin/pisco.js 
    
Aparecerá la ayuda básica de pisco.

```
Name: mymodule 0.0.1 (piscosour 0.1.0) - Example of module nodejs
 Usage: test-convert [Command] [Options...]

 Commands: 


 Options: 

	 --junitReport  [ -u] :  write junit report at the end
	 --help  [ -h] :  shows detailed info of a command: test-convert -h <command>
	 --all  [ -a] :  list all commands availables (repoType:straw[:shot])
	 --list ( all,recipes,straws,shots,repoTypes ) [ -la -lr -lst -lsh -lt] :  list piscosour elements
	 --output ( verbose,debug,silly ) [ -ov -od -os] :  set output level : 'test-convert -ov' -> set to verbose
	 --initShot  [ -i] :  from shot : test-convert -i <shotname>
	 --endShot  [ -e] :  to shot : test-convert -e <shotname>

```

próximos pasos:

* [Trabajar con shots](shots.md) - Crear un shot y usar el API para sacarle el 100% del partido a piscosour.
* [Trabajar con straws](straws.md) - Crear un straw y configurarlo a partir de shots propios o de otras recetas.

