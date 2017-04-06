---
title: installer
name: installer
type: plugins
layout: api_doc.html
---
# Plugins: installer


### Install recipes needed

This plugins install all recipes needed for the execution. 

#### Hooks:

- **'core-install'**: Perform npm installation of the compatible version of the recipe
- **config**: Execute 'pisco -w' in order to write the scullion configuration.
- **run**: Execute the installed step. 

