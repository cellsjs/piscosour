# Inquirer plugin

This plugin uses [inquirer library](https://www.npmjs.com/package/inquirer)

Some addons are provided:

1. [inquire() addon](#inquire)
1. [promptArgs() addon](#promptArgs)

## <a name="inquire"></a>inquire

`this.inquire()` launch inquire based in piscosour configuration. See [inquire](../guides/06-inquire.md) for more information. It has no paramater.

Example:

```javascript
  this.inquire();
```

## <a name="promptArgs"></a>promptArgs

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
