# piscosour



# Install piscosour

    npm install piscosour -g 

Note: -g is used if you want to install the module globally in your enviroment

# Using piscosour as a command

In order to see the commands that you have available for execution execute: 

    pisco

or

    pisco -h    
    
# Params loading

all the params are loaded into the shot.runner.params object

Priority order

1) command params (--<param> <value>)
2) local config
    - prompt - env
    - straw
    - shot
    - prompt (value ,default)
3) recipe config
    - prompt - env
    - straw
    - shot
    - prompt (value, default)
