---
title: Plugins
layout: doc_page.html
order: 7
---

# Plugins

Plugins are a mixin to help developers to reuse code and functionality between [steps](./02-steps.md).

Plugins are implements with three files in the recipe:

```
-rwxr-xr-x    1 pisco  staff   plugins/plugin-name/config.json
-rwxr-xr-x    1 pisco  staff   plugins/plugin-name/index.js
-rwxr-xr-x    1 pisco  staff   plugins/plugin-name/info.md
```

There is two ways to use plugins:

1. Like a [stage hook](#hooks) that is executed previously to the step.
1. Like a [addon](#addons), this add functionality to the object `this`. 

Note, it exists a [scaffold generator tool](#scaffold) that help to add a plugin to an existing receipt.

## `config.json` configuration

The `config.json` file has the definition of the step.

Example:

```json
{
  "name": "sayHello",
  "description": "Say Hello World"
}
```

Where the `config.json` file can configure the following fields:

### `name` property

Short name of the plugin, it must be descriptive and unique.

- It is mandatory
- String type expected

### `description` property

It is a short description about the plugin.

- It is mandatory
- String type expected

## `index.js` implementation

The `index.js` file implements the flow. The [scaffold](#scaffold) generates a file like this:

Example:

```javascript
module.exports = {
  check: function() {
    this.logger.info('#blue', 'running check hook...', 'Check if all you need to execute this step exists');
  },

  config: function() {
    this.logger.info('#yellow', 'running config hook...', 'Config the step to run');
  },

  run: function(ok, ko) {
    this.logger.info('#black', 'running run hook...', 'Run the step');
  },

  prove: function() {
    this.logger.info('#green', 'running proove hook...', 'Check if the step has run ok');
  },

  notify: function() {
    this.logger.info('#grey', 'running notify hook...', 'Notify the end of the shot to someone or something');
  },

  emit: function() {
    this.logger.info('#white', 'running emit hook...', 'Emit the result of the step to other steps. Allow communication between steps');
  },

  addons: {
    testAddon: function(param1) {
      this.logger.info('Test addon executed', param1);
    }
  }
};
```

### <a name="hooks"></a>Hooks

The hooks could be executed previously at every [stages](./04-stages.md) of a [step](./02-steps.md).

1. `check`: check if all you need to execute this step exists.
1. `config`: config the step to run.
1. `run`: run main execution of the step.
1. `prove`: check if the step has run ok.
1. `notify`: notify the end of the shot to someone or something.
1. `emit`: emit the result of the step to other steps. Allow communication between steps.

- When a hook is running `this` is a [step](./02-steps.md) instance, so it could access (as the step) to all the properties and functions of `this`
- Hooks just can return a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). It is not allowed to return other type.

Example:

```javascript
module.exports = {
  check: function() {
    this.logger.info('#blue', 'Random Promise');
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.floor(Math.random() * 2) ?
          resolve('OK :)') :
          reject('KO :(')
      }, 500);
    });
    return promise;
  }
}
```

### <a name="addons"></a>Addons

The addons are methods added to the object `this`.

Example:

`plugins/plugin-sample/index.js`:

```javascript
module.exports = {
  addons: {
    testAddon: function(param1) {
      this.logger.info('Test addon executed', param1);
    }
  }
};
```

Then, in a step or another plugin, it can be executed `this.testAddon`.

## Configuring Plugins for a [Step](./02-steps.md)

Example:

### Creating a plugin

First create a plugin `plugin-sample` and the files (see [scaffold](#scaffold)):

- `plugins/plugin-sample/index.js`:

```javascript
module.exports = {
  addons: {
    testAddon: function(param1) {
      this.logger.info('Test addon executed', param1);
    }
  }
};
```

- `plugins/plugin-sample/config.json`:

```json
{
  "name": "plugin-sample",
  "description": "a example of plugin"
}
```

### Configuring the step

Then, if the plugin is an external dependency, check if it is defined in the `package.json` file.

```sh
$ npm install plugin-sample --save
```

In any case, you must configure the `plugins` field in `config.json` file:

```json
{
  "name": "stepSample",
  "description": "description of stepSample",
  "contexts": [ "contextSample" ],
  "plugins": [ "plugin-sample" ]
}
```

Finally you can use `this.testAddon` in any stage of the [step](./02-steps.md).

```javascript
module.exports = {
  run: function(ok, ko) {
    this.testAddon('sample');
    return;
  }
};
```

## Guidelines

1. Create a namespace. it is advisable to create commons related plugins within a single recipe.
1. Prefix the plugin functions with the common namespace.

## <a name="scaffold"></a>Scaffold generator

Pisco provides a scaffold generator. Launch it placed inside your recipe with:

```sh
$ cd your-recipe
$ pisco recipe:add-plugin
```


