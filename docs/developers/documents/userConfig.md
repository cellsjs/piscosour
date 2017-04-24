---
title: userConfig
name: userConfig
type: plugins
layout: api_doc.html
---
# Plugins: userConfig


# userConfig plugin

These are the addons to work with the global user configuration file `$HOME/.piscosour/piscosour.json`.

1. [userConfigRead() addon](#userConfigRead)
1. [userConfigWrite() addon](#userConfigWrite)
1. [userConfigGet() addon](#userConfigGet)
1. [userConfigSet() addon](#userConfigSet)

## <a name="userConfigRead"></a>1. userConfigRead() addon

`this.userConfigRead()` returns an object containing the global user configuration file (`$HOME/.piscosour/piscosour.json`), or an empty object if the file is not found.

It has no parameters.

Example:

```javascript
run: function(resolve, reject) {
  this.logger.info('json user config', this.userConfigRead());
  return true;
}
```

It will display the content of `$HOME/.piscosour/piscosour.json`.

## <a name="userConfigWrite"></a>2. userConfigWrite() addon

`this.userConfigWrite(userConfig)` serializes the `userConfig` as a JSON object, writes it to the global user configuration file (`$HOME/.piscosour/piscosour.json`), and returns the content of the file.

If the file `$HOME/.piscosour/piscosour.json` does not exists, then it is created.

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| userConfig | Object | No | A JSON object containing the user configuration to write |

Example:

```javascript
run: function(resolve, reject) {
  let config = this.userConfigWrite({
    'param1': 'value1',
    'param2': 'value2',
    'param3': 'value3',
    'param4': 'value4'
  });
  this.logger.info('json user config', config);
  return true;
}
```

Then the content of `$HOME/.piscosour/piscosour.json` is:

```json
{
  "param1": "value1",
  "param2": "value2",
  "param3": "value3",
  "param4": "value4"
}
```

Beware, this will replace the current content of `$HOME/.piscosour/piscosour.json` file.

## <a name="userConfigGet"></a>3. userConfigGet() addon

`this.userConfigGet(key)` returns the value associated with the `key` in the global user configuration file (`$HOME/.piscosour/piscosour.json`), or null if not found.

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| key | String | No | Key whose mapped value is wanted |

Example:

```javascript
run: function(resolve, reject) {
  this.logger.info('param1 user config', this.userConfigGet('param1');
  return true;
}
```

If `$HOME/.piscosour/piscosour.json` has the following content:

```sh
$ cat ~/.piscosour/piscosour.json
{
  "param1": "value1",
  "param2": "value2",
  "param3": "value3",
  "param4": "value4",
}
```

Then `this.userConfigGet('param1')` will return `value1`.

## <a name="userConfigSet"></a>4. userConfigSet() addon

`this.userConfigSet(key, value)` maps the `value` to the `key` in the global user configuration and writes it to the file (`$HOME/.piscosour/piscosour.json`).
Returns the user config object.

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| key | String | No | Key to associate to the value |
| value | Object | No | Value associated to the key |

Example:

```javascript
run: function(resolve, reject) {
  this.userConfigSet('param1': 'foo');
  return true;
}
```

Then `$HOME/.piscosour/piscosour.json` has the following content:

```sh
$ cat ~/.piscosour/piscosour.json | grep "param1"
  "param1": "foo",
```


