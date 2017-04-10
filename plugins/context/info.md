# `context` plugin

[Context](../guides/01-contexts.md) is one of the main concept in piscosour, the [contexts](../guides/01-contexts.md) define ***where*** and ***when*** pisco can be executed.

This plugin provides:

1. [check() hook](#check)
1. [ctxIs() addon](#ctxIs)
1. [ctxWhoami() addon](#ctxWhoami)
 
## <a name="check"></a>1. Hook: check()

Check one shot is executed in the root of any repository type. 

If the working directory where pisco is executed detects one or more contexts, then will show the following message:

```sh
Context checked: Execution contexts: [ documentation, recipe, develop ]
```
If not, then:

```sh
This is not the root of a [ documentation, recipe, develop ]
```

There is two special corner case:

- With `disableContextCheck` parameter, it is possible to skip the check() hook. This is useful in the command line option `--b-disableContextCheck`.
- The `isGenerator` parameter allows to create a context, so the check() will be skipped.

## <a name="ctxIs"></a>2. Addon: ctxIs()

Use `this.ctxIs` to test if pisco is executed over a specific context and returns a boolean.

| Param | Description |
| --- | --- |
| name | name of the context to test|

Example:

```javascript
run: function() {
  let isComponent = this.ctxIs("component");
}
```

Then, `isComponent` is `true` if your recipe was executed in the root of a `component`.

## <a name="ctxWhoami"></a>3. Addon: ctxWhoami()

Returns the list of contexts where recipe is executed. It has no parameters.

Example:

```javascript
run: function() {
  let repos = this.ctxWhoami();
}
```

THen `repos` is an Array of context strings that match the place where the recipe is executed.