# Inquirer plugin

This plugin use inquirer library [Inquirer documentation](https://www.npmjs.com/package/inquirer)

Some file I/O addons are provided:

1. [inquire() addon](#inquire)
1. [promptArgs() addon](#promptArgs)

## <a name="inquire"></a>inquire

`this.inquire()` launch inquire based in piscosour configuration. See [inquire](../guides/06-inquire.md) for more information. It has no paramater.

Example:

```javascript
  this.inquire();
```

## <a name="promptArgs"></a>promptArgs

`this.promptArgs(array)` gets list of parameters

| Param | Description |
| --- | --- |
| array | optional paramaters |

Example:

```javascript
run: function(resolve, reject) {
  return this.execute('command', this.promptArgs([]))
      .then(resolve, reject);
}
```