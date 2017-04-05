---
title: Best practices
layout: doc_page.html
order: 12
---

# Piscosour Packaging Guidelines

The maximun power of Piscosour is when everything is separated, so is very convenient to pack steps, flows or plugins as separate as possible.

## (1) Recipe module

Is a node module with steps / flows / (even plugins) inside. Has a bin/pisco.js script with the executable of the recipe.

recipe module has this structure

```
| package.json
| piscocour.json
| bin | pisco.js
| steps | <stepName> | <repoType> | step.js
                                  | info.md
                                  | params.js
| flows | <flowName> | flow.json
                       | info.md                                  
```

## (2) Plugin module

If you want to share any kind of functionality between steps the best way to do this is using a plugin. Each plugin shout be package inside a independent node module in order to get maximun reuse capabilities.

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
2. pisco-(toolName) (Recipe module with the steps that use this tool)

For example if you want to wrapp the git functionality, the plugin has to be named this way:

- pisco-plugin-git

The steps has to be inside a recipe with this name

- pisco-git
