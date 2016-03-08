# Instalación de piscosour

Instalar piscosour como un comando global. (-g) 

    npm install -g piscosour 

# Guia de usuario.

Ejecutando el comando sin parámetros accederemos a la ayuda de la herramienta.  

    pisco

```
Name: piscosour 0.0.17  - Devops recipes for all your CI tests
 Usage: pisco [Command] [Options...]

 Commands: 

	 install ( Install other piscosour recipes inside a recipe )
	 config ( Manage shots/straws of a recipe )
	 convert ( Convert any module into a piscosour recipe )
	 create ( Starting a repository from scratch )

 Options: 

	 --junitReport  [ -u] :  write junit report at the end
	 --commands ( all ) [ -a] :  list prepared commands of piscosour
	 --list ( all,recipes,straws,shots,repoTypes ) [ -la -lr -lst -lsh -lt] :  list piscosour elements
	 --initShot  [ -i] :  from shot : pisco -i <shotname>
	 --endShot  [ -e] :  to shot : pisco -e <shotname>
	 --level ( debug,verbose,warning ) [ -l -d -w] :  debug level of output : pisco -l verbose

```

Pisco es una herramienta que genera herramientas, cada una de las herramientas generadas (recetas) tiene su propio comando con una ayuda similar a la disponible por el comando padre.
 
    cells

```
Name: pisco-cells 0.0.5 (piscosour 0.0.17) - A piscosour recipe for cells CI process
 Usage: cells [Command] [Options...]

 Commands: 

	 validate ( component build and validate )

 Options: 

	 --junitReport  [ -u] :  write junit report at the end
	 --commands ( all ) [ -a] :  list prepared commands of piscosour
	 --list ( all,recipes,straws,shots,repoTypes ) [ -la -lr -lst -lsh -lt] :  list piscosour elements
	 --initShot  [ -i] :  from shot : cells -i <shotname>
	 --endShot  [ -e] :  to shot : cells -e <shotname>
	 --level ( debug,verbose,warning ) [ -l -d -w] :  debug level of output : cells -l verbose
```

Cuando se añaden paquetes a una receta dada la ayuda contextual reflejará los nuevos comandos disponibles.