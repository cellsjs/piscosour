# Plugins: piscosour


# piscosour plugin

Plugin to get information about piscosour configuration.

1. [piscoConfig() addon](#piscoConfig)
1. [piscoFile addon](#piscoFile)
1. [pkgFile addon](#pkgFile)
1. [Waterfall() addon](#Waterfall)

## <a name="piscoConfig"></a>1. piscoConfig() addon

`this.piscoConfig()` a function that exposes the piscosour configuration.

It has no parameters.

Example:

```javascript
run: function(resolve, reject) {
  this.logger.info('config?', this.piscoConfig());
  return true;
}
```

## <a name="piscoFile"></a>2. piscoFile addon

`this.piscoFile` a value with the piscosour file name ('piscosour.json').

Example:

```javascript
run: function(resolve, reject) {
  this.logger.info('piscoFile?', this.piscoFile);
  return true;
}
```

## <a name="pkgFile"></a>3. pkgFile addon

`this.pkgFile` a value the package file name ('package.json').

Example:

```javascript
run: function(resolve, reject) {
  this.logger.info('pkgFile?', this.pkgFile);
  return true;
}
```

## <a name="Waterfall"></a>4. Waterfall() addon

`this.Waterfall(config)` a function that returns an Object to prepare the execution of a list of [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| config | Object | No | An object with the configuration |

Where `config` object allows these properties:

| Property | Type | Description |
| --- | --- | --- |
| logger | Object | reference to `this.logger` |
| promise-config | Array | list of promise configuration |

Where `promise-config` has the following properties:

| Property | Type | Description |
| --- | --- | --- |
| fn | function | function that returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) |
| args | Array | The argurments of the function 'fn' |
| obj | Object | Reference to the object this |

Once the object `this.Waterfall(config)` is created, its function `start()` returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to start the execution of the promises one after the other.

Example:

```javascript
run: function(resolve, reject) {
  let waterfall = new this.Waterfall({
    promises: [{
      fn: this.execute,
      args: ['echo', 'exec1'],
      obj: this
    },{
      fn: this.execute,
      args: ['sleep', '5'],
      obj: this
    }],
    logger: this.logger
  });
  return waterfall.start().then(resolve, reject);
}
```


