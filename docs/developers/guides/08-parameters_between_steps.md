---
title: Communication between steps
layout: doc_page.html
order: 8
---

# Parameters transmision between [steps](./02-steps.md)

Sometimes we need to emit generated parameter from a [step](./02-steps.md) into another [step](./02-steps.md).

## Define output parameters

There is a special stage in [steps](./02-steps.md) called **'emit'**. The emit behavior is wide different from other stages behaviors.

   1. Allways has to return an key:value object with the parameters we want to expose to others steps.
   2. **emit** doesn't recive resolve and reject method so allways is synchronous
   3. Parameters emitted replace any previously parameter definition by configuration [See parameters for more information](./05-parameters.md).
   4. Parameters are emitted only for the contexts defined on config.json of the step. [See steps for more information](./02-steps.md).

As other stages **emit** is optional

Example in any `steps/stepName/index.js`:

```javascript
  emit: function() {
    return {
      param1: "any text value",
      param2: {
        param3: "thing",
        param4: []
      }
    }
  }
```

## Input in other steps.

All parameters emitted are going to be available on this.params object of all upper steps. 

- Input are always set into `this.params` of all upper steps of the flow only in the context of the emitted step.

So, any other upper step on any flow in our example have this code:

```javascript
  run: function() {
    console.log(this.params.param1);
  }
```

That results in the console:

```
any text value
```

## DEPRECATED: DO NOT USE - Connect outputs with inputs in other steps. (Just back compatibility mode)

- This is can be defined in the [flow](./03-flow.md) configuration).
- Input are always set into `this.params`.
- Inputs only can get values from previous steps in the flow.

Example:

The following code in `flows/flowName/config.json` file:

```javascript
  "steps" : {
    "test1" : {},
    "test2" : {
      "inputs" : {
        "param5" : {"test1": "param1"}
      }
    }
  }
```

Sets `this.params.param5` parameter of `test2` step, with the value of `this.params.param1` parameter emit by `test1`.

So, the step `steps/step2/index.js` could have this code:

```javascript
  run: function() {
    console.log(this.params.param5);
  }
```

That results in the console:

```
any text value
```
