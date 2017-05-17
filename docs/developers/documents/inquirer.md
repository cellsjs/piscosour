---
title: inquirer
name: inquirer
type: plugins
layout: api_doc.html
---
# Plugins: inquirer


# Inquirer plugin

This plugin uses [inquirer library](https://www.npmjs.com/package/inquirer)

Functionality:

1. [check hook](#check)
1. [inquire(name) addon](#inquire)
1. [promptArgs() addon](#promptArgs)

## <a name="check"></a>check hook

This hook is the responsible to run all functionality explained on [inquire](../guides/06-inquire.md). Use prompts parameter from config.json to be configured.

NOTE: Is possible to disable this hook with using --disablePrompts when you run pisco command line.

## <a name="inquire"></a>1. inquire(name) addon

`this.inquire(name)` returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and push all parameters asked to this.params object.

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| name | String | No | Name of the parameter inside this.params to use as prompts |


`this.inquire(name)` launch inquire based in piscosour configuration. See [inquire](../guides/06-inquire.md) for more information.

Example:

In index.js of the step.

```javascript
    this.inquire('promptsCordova')
        .then(() => {
          if (this.params.doRestore) {
            // Do stuff
          }
        });
```

in config.json of the step 

```javascript
  "promptsCordova": [
    {
      "type": "confirm",
      "name": "doRestore",
      "default": true,
      "required": true,
      "message": "Plugins and/or platforms already exists, do you want to regenerate it?"
    }
  ]
```

Note that is possible to define promptsCordova inside index.js this way:

```javascript
    this.params.promptsCordova = [
                                     {
                                       "type": "confirm",
                                       "name": "doRestore",
                                       "default": true,
                                       "required": true,
                                       "message": "Plugins and/or platforms already exists, do you want to regenerate it?"
                                     }
                                   ]; 
    this.inquire('promptsCordova')
        .then(() => {
          if (this.params.doRestore) {
            // Do stuff
          }
        });
```



## <a name="promptArgs"></a>2. promptArgs() addon

`this.promptArgs(array)` returns an `Array` with the list of configured [inquirer prompts](../guides/06-inquire.md) according to the command line format such as:

```javascript
['--param1', 'value1', '--param2', 'value2', '...']
```

| Param | Type | Description |
| --- | --- | --- |
| initialArray | Array | An initial array of parameters/values where parameters/values of the configuration are going to be added |

Example:

```json
{
  "prompts": [
    {
      "type": "input",
      "name": "param1",
      "message": "#randomMessage"
    }
  ]
 }
```

```javascript
run: function(resolve, reject) {
  return this.execute('echo', this.promptArgs(['--sample', 'valueSample']))
      .then(resolve, reject);
}
```

Where `this.promptArgs(['--sample', 'valueSample'])` will return an array:

```javascript
[
  '--sample', 'valueSample',
  '--param1', 'valueInquirer'
]
```




