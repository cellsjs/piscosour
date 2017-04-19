---
title: Steps
layout: doc_page.html
order: 2
---

# Steps

Steps often belong to an execution [flow](./03-flows.md), and usually are executed in a [context](./01-contexts.md).

Contexts are implements with three files in the recipe:

```
-rwxr-xr-x    1 pisco  staff   steps/step-name/config.json
-rwxr-xr-x    1 pisco  staff   steps/step-name/index.js
-rwxr-xr-x    1 pisco  staff   steps/step-name/info.md
```

Where the `config.json` file has the configuration, `info.md` explain and document the step, and `index.js` has the implementation of the step.

Note, it exists a [scaffold generator tool](#scaffold)

## `config.json` configuration

The `config.json` file has the definition of the step.

Example:

```json
{
  "name": "sayHello",
  "description": "Say Hello World",
  "isGenerator": false,
  "contexts": [ "context1", "context2" ],
  "plugins": [ "plugin1", "plugin2" ],
  "prompts": {},
  "param1": "value1",
  "param2": 2,
  "param3": { "object1": "value" }
}
```

The `config.json` file can configure the following fields:

### `name` property

Short name of the step, it must be descriptive and unique.

- It is mandatory
- String type expected

### `description` property

It is a short description about the step.

- It is mandatory
- String type expected

### `isGenerator` property

If the steps creates a context, then fill a 'true' value. Otherwise 'false'.

- It is optional
- The default value is 'false'.
- Boolean type expected

### `contexts` property

Array of contexts which step can be executed.

- It is mandatory
- Array of string expected

Example: `"contexts": [ "context1", "context2" ]`

### `plugins` property

Array of [plugins](./07-plugins.md) injected into the step.

- It is optional
- The default value is an empty array. `"plugins": []`

Example: `"plugins": [ "plugin1", "plugin2" ]`

### `prompts` property

Array of [inquire prompts](./06-inquire.md) of the step.

- It is optional
- The default vulue is an empty array. `"prompts": []`

Example:

```json
{
  "prompts": [
    {
      "type": "input",
      "name": "param1",
      "required": true,
      "default": "value1",
      "message": "Write the param1"
    }, {
      "type": "confirm",
      "name": "param2",
      "required": true,
      "message": "Write the param2"
    }
  ]
}
```

See [inquire prompts](./06-inquire.md) for more information.

### <a name="paramaters"></a>Other customized params

And others customized paramaters, see [parameters](./05-parameters.md) for more information.

```json
{
  "param1": "value1",
  "param2": "value2",
  "param3": "value3"
}
```

In the step implementation, parameters are available with `this.params`.

Example:

```javascript
module.export = {
  run: function() {
    console.log(
      this.params.param1,
      this.params.param2,
      this.params.param3);
  }
}
```

This customized paramaters are common to all contexts.

## `index.js` implementation

The `index.js` file implements the flow. The [scaffold](#scaffold) generates a file like this:

```javascript
module.exports = {
  check: function() {
    this.logger.info('#blue', 'Check if all you need to execute this step exists');
  },

  config: function() {
    this.logger.info('#yellow', 'Config the step to run');
  },

  run: function(ok, ko) {
    this.sh('echo Run main execution of the step', ko, true);
  },

  prove: function() {
    this.logger.info('#green', 'Check if the step has run ok');
  },

  notify: function() {
    this.logger.info('#grey', 'Notify the end of the shot to someone or something');
  },

  emit: function() {
    this.logger.info('#white', 'Emit the result of the step to other steps. Allow communication between steps');
    return { message: 'emit a message' };
  }
};
```

The stages of a step are used to:

1. `check`: check if all you need to execute this step exists.
1. `config`: config the step to run.
1. `run`: run main execution of the step.
1. `prove`: check if the step has run ok.
1. `notify`: notify the end of the shot to someone or something.
1. `emit`: emit the result of the step to other steps. Allow communication between steps. Check [parameters transmission between steps](08-parameters_betwwen_steps.md) for more information.

Please see [stages of a step](./04-stages.md) for more information. And check [advanced step feature](./09-steps-advanced.md) to help you how to implement those stages.

## Documentation

The `info.md` file just explain the context with a markdown format:

```markdown
# Step step-name

The description about the step.
```

## <a name="scaffold"></a>Scaffold generator

Pisco provides a scaffold generator. Launch it placed inside your recipe with:

```sh
$ cd your-recipe
$ pisco recipe:add-step
```
