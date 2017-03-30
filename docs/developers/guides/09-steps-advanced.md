---
title: Advanced features in steps
layout: doc_page.html
order: 9
---

# Advanced features in steps

Each [stage](./04-stages.md) of a [step](./02-steps.md) (except `emit` stage) are [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) functions, so its received two paramters `resolve` and `reject`.

Two main point:
1. [General Tips & Tricks](#tips-tricks)
1. [Steps error handling](#error-handling)
1. [Conditional steps](#conditional)

## <a name="tips-tricks"></a>General Tips & Tricks

Some [step](./02-steps.md)'s implementation **tips & tricks** are:

(Please check this [advanced article](https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html) about promises for more information)

### <a name="resolve-automatic"></a>1. `resolve` is executed automatically

At the end of each stage, the function `resolve` is automatically executed.

The following code:

```javascript
  run: function(resolve, reject){
     resolve();
  }
```

Is like:

```javascript
  run: function(resolve, reject){
     resolve();
  }
```

### 2. Usually return a value

If you don't want to execute the `resolve` function, it is required to return a different value of `undefined`.

Example:

```javascript
  run: function(resolve, reject){
     return true;
  }
```

### 3. Background execution

It is possible to have a [stage](./04-stages.md) execution in background if nothing is returned.

This is useful with flow that has more than one step, and one of this steps needs to be executed in background (for example, a background process to convert 'sass' to 'css').

Maybe, it could have more sense to implement the background function in a [plugin](07-plugins.md).

### 4. Delegate promises to [plugins](07-plugins.md)

A good practice is to delegate [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to [plugins](07-plugins.md).

Example:

```javascript
  run : function(resolve, reject) {
    return this.execute("pwd").then(resolve,reject);
  }
```

Where:
- `this.execute` is a 'core' plugin that returns a promise. If we return this promise, then the `resolve()` will be not [called automatically](#resolve-automatic").
- The [stage](./04-stages.md) will finish when the [plugin](07-plugins.md) `this.execute` is over, because `resolve()` and `reject()` are parameters of `then()`.

## <a name="error-handling"></a>[Steps](02-steps.md) error handling

Usually when there is a error in a [step](./02-steps.md), and it is an unhandling error, then the execution of all the flow will finish.

### `reject()` with `keep` field

If we don't want to stop all the [flow](./03-flows.md) execution, for a error in a [step](./02-steps.md), then called `reject()` with `{keep: true}`.

```javascript
reject({keep: true});
``` 

- By default `keep` is `false`.

### `reject()` with `error` field

You can send a descriptive text error calling `reject()` with `{error: txt}`

```javascript
reject( { error: 'descriptive text error' } );
```

### `reject()` with `data` field

`data` in the `reject()` function allows to send more detail about the error, this is very interesting when we use piscosour for continuous integration (jenkins, bamboo, travis, ...) with the junit option.

```javascript
reject( { data: 'details of the error' } );
```

### `reject()` example

All field (`keep`, `error`, `data`) can work together:

```javascript 
module.export = {
  run: function(resolve, reject) {
    reject({
        keep: true,
        error: 'error text',
        data: 'detail\'s error'
    })
  }
}
```

## <a name="conditional"></a>Conditional [steps](./02-steps.md)

Steps could be executed conditionally evaluating a customized expression in the `check()` [stage](./04-stages.md).

### `resolve()` with `skip` field

So below there is an example about how could be executed conditionally a step. This condition may be implemnented in the `check()` [stage](./04-stages.md). And if the step must be skipped and not executed, please provide to `resolve()` a field with `{skip: true}`

Example:

```javascript
  check : function(resolve, reject) {
    if (this.params.needThisstep) {
      resolve({skip: true});
    }
  }
```

So, the remaining [stages](./04-stages.md) of this steps are not going to be executed.
