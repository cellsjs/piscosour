---
title: Flows
layout: doc_page.html
order: 3
---

# Flows

Flows are a list of executed steps. A command are a flow for piscosour. The flows don't work over a [context](./01-contexts-md), [step](./02-steps.md) do that, so flows can work over multiple steps, and different contexts. 

The flow execution is sequential, step by step, and step are executed for each context. Note that if a step is no defined for any context it is no executed.

Flows are implements with three files in the recipe:

```
-rwxr-xr-x    1 pisco  staff   flows/flow-name/config.json
-rwxr-xr-x    1 pisco  staff   flows/flow-name/info.md
```

Where the `config.json` file has the configuration, `info.md` explain and document the flow.

Note, it exists a [scaffold generator tool](#scaffold)

## `config.json` configuration

The `config.json` file has the definition of the flow. A example is:

```json
{
  "name": "Create from scratch",
  "description": "Starting a repository from scratch",
  "type" : "normal",
  "excludes" : [ "any" ],
  "isGenerator": true,
  "params": {
    "param1": "value1",
    "param2": 2,
    "param3": true,
    "param4": { "object1": "value" }
  },
  "steps": {
    "step1": {
        "excludes" : [ "any" ],
        "params": {
            "param1": "value1",
            "param2": 2
        }
    },
    "step2": {
        "type" : "flow",
    },
    "step3": {
        "implementation-check" : false    
    }
  }
}
```

In the `config.json` file could be configured the following fields:

### `name` property

Short name of the flow, it must be descriptive and unique.

- It is mandatory
- String type expected

### `description` property

It is a short description about the flow.

- It is mandatory
- String type expected

### `type` property

Type of the flows

- It is optional.
- String type expected.
- Two value options:
 1. `normal`: appears in the command list. It is the default value.
 1. `internal`: doesn't appear int command list. It is for an internal purpose.
 
### `excludes` property

Is an array of contexts witch execution is excluded for all steps of this flow. For example:
  
```json
{
  "name": "validate",
  "description": "Validate CI flow",
  "excludes": ["develop", "master", "feature", "hotfix", "release", "merger", "consolidation"],
    "steps": {
      "install": {
        "type": "flow"
      },
  ....
}
```

The execution of this flow will prompt this on output:

```console
[18:13:32] Run of flow "install" is excluded for context "feature"

```


### `isGenerator` property

If the steps creates a context, then this flag must be with a 'true' value.

- It is optional
- The default value is 'false'.
- Boolean type expected

### `params` property

Others customized paramaters, see [parameters](./05-parameters.md) for more information.

- It is optional
- The default value is an empty array. `"params": []"`
- Array of objects expected

Example:

```json
{
  "params": {
    "param1": "value1",
    "param2": 2,
    "param3": true,
    "param4": { "object1": "value" }
  }
}
```

### <a name="parameters"></a>Understanding parameters in flows

The 'config.json' file of a flow has the following possibilities:

**a. Common parameters for all steps**

```json
{
  "params": {
    "param1": "value1",
    "param2": "value2",
    "param3": "value3"
  }
}
```

**b. Common parameters for all contexts in a specific step**

```json
{
  "params": {},
  "steps" : {
    "stepName" : {
      "params" : {
        "param1": "value1",
        "param2": "value2",
        "param3": "value3",
      }
    }
  }
}
```

**c. Parameters for a specific step and context**

```json
{
  "params": {},
  "steps" : {
    "stepName" : {
      "contextName" : {
        "params" : {
          "param1": "value1",
          "param2": "value2",
          "param3": "value3"
        }
      }
    }
  }
}
```

Allways the parameters are available with `this.params`.

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

The priority is (from high to low):

1. Parameters for a specific step and context
1. Common parameters for all contexts in a specific step
1. Common parameters for all steps

### `steps` property

List of sequential steps in the flow.

- It is mandatory
- Object with the list of step-key:config. Where `config` is an object that optionally contains:
  * `type` which can be `flow` or `step` (step is default value). Flow calls another flow with the name of the step. Nesting could be whatever.
  * `params` with the list of parameters of the step. See [parameters](./05-parameters.md) for more information. *Please note that it isn't appropriate to use params into the configuration of the flow. Usually this must be configurated in the step `config.json` file. The recommendation is to use `params` just to overwrite a step parameter.*
  * `input` to share in a steps a previously emitted parameter in another steps. Please see [parameters between steps](./08-parameters-between-steps) for more information.
  * `excludes` array of contexts witch execution is excluded for this step
  
The execution of this flow will prompt this on output:

```console
[18:13:32] Run of flow "install" is excluded for context "feature"

```

  
  * `implementation-check` If this step is not implemented execution will fail unless this parameter was set to false (default is true).
  
The execution of this flow will prompt this on output:

```console
[18:13:32] Run of step "provide-env" is allowed to be not implemented for context "app"

```
  

Example:

```json
{
  "steps": {
    "step1": {
        "excludes" : [ "any" ],
        "params": {
            "param1": "value1",
            "param2": 2
        }
    },
    "step2": {
        "type" : "flow",
    },
    "step3": {
        "implementation-check" : false    
    }
  }
}
```

#### Repeated steps

In some cases, it may be necessary to repeat the same step twice or more, with different parameters. Then it is possible to identify the step with a sufix separated with ':' character, like `step1:id1`.

Example:

```json
{
  "steps": {
    "mystep:first": {
      "params": {
        "myparam": "value1"
      }
    },
    "mystep:second": {
      "params": {
        "myparam": "value2"
      }
    }
  }
}
```

In the above example, `mystep` is executed twice with different `myparam` configuration. It is advisable that the suffix has a semantic value which describe the differences.

## <a name="scaffold"></a>Scaffold generator

Pisco provides a scaffold generator. Launch it placed inside your recipe with:

```sh
$ cd your-recipe
$ pisco recipe:add-flow
```
