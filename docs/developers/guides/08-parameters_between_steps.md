---
title: Communication between steps
layout: doc_page.html
order: 8
---

# Parameters transmision between [steps](./02-steps.md)

Sometimes we need to emit generated parameter from a [step](./02-steps.md) into another [step](./02-steps.md).

## Define output parameters

There is a special stage in [steps](./02-steps.md) called **'emit'**. The emit behaviour is wide different from other stages behaviours.

   1. Allways has to return an key:value object with the parameters we want to expose to others steps.
   2. **emit** doesn't recive resolve and reject method so allways is synchronous

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

## Connect outputs with inputs in other steps.

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