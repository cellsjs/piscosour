---
title: Guidelines
layout: doc_page.html
order: 12
---

# Piscosour Packaging Guidelines

One advantage of Piscosour is when everything is separated, so is very convenient to pack steps, flows or plugins as separate as possible.

This is guideline with the recommendations of how to separate the modules:

1. [Domain](#domain)
1. [Contexts](#contexts)
1. [Flows](#flows)
1. [Step](#step)
1. [Plugin](#plugin)

## <a name="domain"></a>1. Domain

The domain is a simple recipe module with this structure:

```
| package.json
| piscocour.json
| bin | pisco.js
```

Where:

- The repository is called simply as the domain `domainName`.
- The `package.json` has dependencies with [contexts](#contexts) and [flows](#flows).
- The file `bin/pisco.js` script with the executable of the recipe.

## <a name="contexts"></a>2. Contexts

A repository with the [contexts](./01-contexts.md) of a domain.

```
| package.json
| piscocour.json
| contexts | <contextName> | config.json
                           | index.js
                           | info.md
```

Where:

- The repository is called simply as the domain `pisco-contexts-[domainName]`.
- The file `bin/pisco.js` script with the executable of the recipe.

## <a name="flows"></a>3. Flows

A repository with the [flows](./03-flows.md) of a domain.

```
| package.json
| piscocour.json
| bin | pisco.js
| flows | <flowName> | config.json
                     | info.md
```

Where:

- The repository is called simply as the domain `pisco-flows-[domainName]`.
- The `package.json` has dependencies with [steps](#step)
- The file `bin/pisco.js` script with the executable of the recipe.

## <a name="step"></a>4. Step

A repository for each [step](./02-steps.md).

```
| package.json
| piscocour.json
| bin | pisco.js
| steps | <stepName> | config.json
                     | index.js
                     | info.md
```

Where:

- This repository usually is called `pisco-[stepName]`, where `[stepName]` has a descriptive name. For example if you want to wrapp the git functionality, the step has to be named in this way: `pisco-git`
- The `package.json` has dependencies with [plugins](#plugin)
- The file `bin/pisco.js` script with the executable of the recipe.

## <a name="plugin"></a>5. Plugin

A repository for each [plugin](./07-plugins.md).

Plugin module has this structure:

```
| package.json
| piscocour.json
| plugins | <pluginName> | config.json
                         | index.js
                         | info.md
```

Where:

- This repository usually is called `pisco-plugin-[pluginName]`, where `[pluginName]` has a descriptive name. For example if you want to wrapp the git functionality, the plugin has to be named in this way: `pisco-plugin-git`
