# shortlife

Is a command/module that expose commun gulp commands for the cells project. This command is useful in order to share some comun task between all the cells projects

# Install shortlife

    npm install shortlife -g 

Note: -g is used if you want to install the module globally in your enviroment

# Using shortlife as a command

In order to see the commands that you have available for execution execute: 

    slife

or

    slife -h

In order to execute one gulp task execute:

    slife <task-name>
    
# Using shortlife as a module

Just require the module

    var slife = require("slife-command");

## (1) run (commands)
 
    cellsGulp.run(commands);
    
  Execute all gulp commands, "commands" could be one or an Array of gulp commands.
  
## (2) showTask

    cellsGulp.showTask();
  
  List all gulp task available of this module.

## Deal with the promise

cellsGulp returns a promise so you have to deal with it in order to get the right behaviour of your command. (see index.js for convenience example)

### Array messages  

'Array' returned in both callbacks reject and resolve. 

Contains all the gulp events throwed by the commands executed. (start, task_start, task_stop, task_err, err, etc....) 

# Adding new gulp task to the index

1) Copy your gulp task to the task folder in shortlife project

2) Use the config file 'shortlife.json' for the configuration 
    - use the same name of the gulp file in the configuration file, for vulcanize.js f.i.:
     
     {
        "vulcanize" : {
            "dependenciesToIgnore": [],
            "dependenciesToInclude": [
              "cells-",
              "bbva-"
            ]}
         ...
      }

3) Require the config module in your gulp file.

    var config = require("../lib/cells-config");
 
4) Use the config object inside your gulp file.

    var dependenciesToInclude = config.vulcanize.dependenciesToInclude;


parallel steps is not allowed use gulp instead ["task1", "task2"]