# Piscosour Packaging Best Practices

The maximun power of Piscosour is when eveything is separated, so is very convenient to pack every plugin, straw, shots as split as you can. 

## (1) Recipe module

Is a node module with shots / straws / (even plugins) inside. Has a bin/pisco.js script with the executable of the recipe. 

recipe module has this structure

```
| package.json
| piscocour.json
| bin | pisco.js
| shots | <shotName> | <repoType> | shot.js
                                  | info.md
                                  | params.js
| straws | <strawName> | straw.json
                       | info.md                                  
```

## (2) Plugin module

If you want to share any kind of functionality between shots the best way to do this is using a plugin. Each plugin shout be package inside a independent node module in order to get maximun reuse capabilities.
   
plugin module has this structure: 

```
| package.json
| piscocour.json
| plugins | <pluginName> | plugin.js
                         | info.md
```

## Wrappers nomenclature

When pisco wrapps any tool is a good practice to name the module this way:

1. pisco-plugin-(toolName) (Plugin module with the tool functionality wrapped) 
2. pisco-(toolName) (Recipe module with the shots that use this tool)

For example if you want to wrapp the git functionality, the plugin has to be named this way:

- pisco-plugin-git

The shots has to be inside a recipe with this name 
 
- pisco-git