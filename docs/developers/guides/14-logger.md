---
title: Logger
layout: doc_page.html
order: 14
---

# Logger

Piscosour has a feature to generate a sequential data to stdin or stderr inside a [step](02-steps.md).

Example of use:

```javascript
run: function() {
  this.logger.info('#green', 'text');
}
```

There are 6 levels:

1. [error](#error)
1. [warning](#warning)
1. [info](#info)
1. [verbose](#verbose)
1. [debug](#debug)
1. [silly](#silly)

## <a name="error"></a>Error

`this.logger.error(msg, ...)` outputs a msg to stderr.

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| msg | Object | No | Outputs the object to stderr, except it is a Color. Colors are specified like `'#color'`, when color has been specified, then next parameter will be coloured with the last color. Please see [chalk](https://github.com/chalk/chalk) library to see which colors are supported.|

Example:

```javascript
run: function() {
  this.logger.error('#green', 'text', '#blue', 'text2', { key1: 'value2' });
}
```

Shows colored message:

```sh
[12:08:54] run stage running...
[12:08:54] text text2 { key1: 'value2' }
```

Where `test` is green and `test2` is blue.

## <a name="warning"></a>Warning

`this.logger.warn(msg, ...)` warn a msg to stdout. By default warn message are showed in console.

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| msg | Object | No | Outputs the object to stderr, except it is a Color. Colors are specified like `'#color'`, when color has been specified, then next parameter will be coloured with the last color. Please see [chalk](https://github.com/chalk/chalk) library to see which colors are supported.|

Example:

```javascript
run: function() {
  this.logger.warn('#green', 'text', '#blue', 'text2', { key1: 'value2' });
}
```

Shows colored message:

```sh
[12:08:54] run stage running...
[12:08:54] text text2 { key1: 'value2' }
```

Where `test` is green and `test2` is blue.

## <a name="info"></a>Info

`this.logger.info(msg, ...)` info a msg to stdout. By default warn message are showed in console.

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| msg | Object | No | Outputs the object to stderr, except it is a Color. Colors are specified like `'#color'`, when color has been specified, then next parameter will be coloured with the last color. Please see [chalk](https://github.com/chalk/chalk) library to see which colors are supported.|

Example:

```javascript
run: function() {
  this.logger.info('#green', 'text', '#blue', 'text2', { key1: 'value2' });
}
```

Shows colored message:

```sh
[12:08:54] run stage running...
[12:08:54] text text2 { key1: 'value2' }
```

Where `test` is green and `test2` is blue.

## <a name="verbose"></a>Verbose

`this.logger.trace(msg, ...)` trace a msg to stdout. By default verbose message are not showed in console (see [Command Line Interface](#cli) for more information).

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| msg | Object | No | Outputs the object to stderr, except it is a Color. Colors are specified like `'#color'`, when color has been specified, then next parameter will be coloured with the last color. Please see [chalk](https://github.com/chalk/chalk) library to see which colors are supported.|

Example:

```javascript
run: function() {
  this.logger.trace('#green', 'text', '#blue', 'text2', { key1: 'value2' });
}
```

When it is executed with `-ov` option (see [Command Line Interface](#cli)) shows colored message:

```sh
[12:08:54] run stage running...
[12:08:54] text text2 { key1: 'value2' }
```

Where `test` is green and `test2` is blue.

## <a name="debug"></a>Debug

`this.logger.debug(msg, ...)` info a msg to stdout. By default debug message are not showed in console (see [Command Line Interface](#cli) for more information).

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| msg | Object | No | Outputs the object to stderr, except it is a Color. Colors are specified like `'#color'`, when color has been specified, then next parameter will be coloured with the last color. Please see [chalk](https://github.com/chalk/chalk) library to see which colors are supported.|

Example:

```javascript
run: function() {
  this.logger.debug('#green', 'text', '#blue', 'text2', { key1: 'value2' });
}
```

When it is executed with `-od` option (see [Command Line Interface](#cli)), shows colored message:

```sh
[12:08:54] run stage running...
[12:08:54] text text2 { key1: 'value2' }
```

## <a name="silly"></a>Silly

`this.logger.silly(msg, ...)` shows a silly msg to stdout. By default silly message are not showed in console (see [Command Line Interface](#cli) for more information).

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| msg | Object | No | Outputs the object to stderr, except it is a Color. Colors are specified like `'#color'`, when color has been specified, then next parameter will be coloured with the last color. Please see [chalk](https://github.com/chalk/chalk) library to see which colors are supported.|

Example:

```javascript
run: function() {
  this.logger.silly('#green', 'text', '#blue', 'text2', { key1: 'value2' });
}
```

When it is executed with `-ov` option (see [Command Line Interface](#cli)), shows colored message:

```sh
[12:08:54] run stage running...
[12:08:54] text text2 { key1: 'value2' }
```

# <a name="cli"></a>Command Line Interface

To show all errors to an specific level, please use one of the following options:

```
$ pisco --output ( verbose | debug | silly ) [ -ov | -od | -os]
```

Examples:

```sh
$ pisco --output verbose
```

Or

```sh
$ pisco -ov
```
