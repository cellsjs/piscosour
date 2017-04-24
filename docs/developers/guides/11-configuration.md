---
title: Receipt Configuration
layout: doc_page.html
order: 11
---

# Receipt Configuration

`piscosour.json` is the file which defines the general configuration of the receipt. It is placed at the root directory of the receipt.

The configuration receipt could be overwritten with others available methods to fill parameters values. See [parameters](./05-parameters.md) configuration.

This is the general configuration file (`piscosour.json`) of piscosour:

```json
{
  "cmd" : "pisco",
  "params" : {
    "plugins" : ["inquirer"]
  },
  "junitDir": "test-reports",
  "junitPiscoFile": "pisco-junit.xml",
  "stages": [
    "check",
    "config",
    "run",
    "prove",
    "notify"
  ],
  "flowTypes": [
    "normal",
    "utils",
    "internal"
  ]
}
```

Then the different methods to configure (receipts, flows, steps, ...) will just add or remove configuration over the existing configuration.

Example of a receipt:

```json
{
  "cmd": "cells"
}
```

## Main fields

### `cmd` field

Command name, this command will be executed in a console when the receipt is globally installed.

### `params` field

Global parameters, applies to all [flows](./03-flows.md) and [steps](./02-steps.md). See [parameter](./05-parameters.md) for more information.

### `junitDir` and `junitPiscoFile` fields

`junitDir` is the Folder where will save the `junit.xml` file.
`junitPiscoFile` is a customized name of the `junit.xml` file.

These configurations are available when pisco write a junit report.

```sh
$ pisco --junitReport
$ pisco -u
```

### `stages` field

Default stages. See [stages](./04-stages.md) for more information.

If it is added a new stage, and will be just executed if the step has its implementation.

```json
{
 "stages": [ "final" ]
}
```

After `notify` stage, customized `final` stage will be executed.

```javascript
  final : function() {
    this.logger.info("#magenta","notify","Recollect all execution information and notify");
  }
```

### `flowTypes` field

See [flows](./03-flows.md) for more information.

## <a name="parameters"></a>Piscosour parameter syntax

Configuration has different options according to the scopes:

### Global configuration

For all flows, steps and contexts

```json
{
  "params": {
    "param1": "value1"
  }
}
```

### Flow configuration

Just for a flow and all its steps and contexts.

```json
{
  "flows" : {
    "flowName" : {
      "params" : {
        "param1": "value1"
      }
    }
  }
}
```

### Step configuration

Just for a step and all its contexts.

```json
{
  "steps" : {
    "stepName" : {
      "params" : {
        "param1": "value1"
      }
    }
  }
}
```

### Step & Context configuration

Just for a step and a context.

```json
{
  "steps" : {
    "stepName" : {
      "contextName" : {
        "params" : {
          "param1": "value1"
        }
      }
    }
  }
}
```

In a [step](./02-steps) all parameters are accessible with `this.params.param1`.

### Priority:

- **1** `.piscosour/piscosour.json` file in the current working directory where recipe is executed.
    - **1.1** Step & Context configuration
    - **1.2** Step configuration
    - **1.3** Flow configuration
    - **1.4** Global configuration
- **2** `piscosour.json` file of the receipt.
    - **1.1** Step & Context configuration
    - **1.2** Step configuration
    - **1.3** Flow configuration
    - **1.4** Global configuration

This is the priority order (from high to low), if a parameter is provided twice or more, with different values, then it will stay the value that is above in the list.
