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

- **&#39;core-install&#39;**: Perform npm installation of the compatible version of the recipe
- **config**: Execute &#39;pisco -w&#39; in order to write the scullion configuration.
- **run**: Execute the installed step. 

