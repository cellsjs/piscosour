---
title: Inquire
layout: doc_page.html
order: 6
---

# Inquire parameters

To inquire parameters you must add the configuration in `prompts` field. This an array with customized parameters:

```json
  "prompts": [
    {
      "type": "input",
      "name": "param1",
      "message": "What is the value of param1"
    }, {
      "type": "input",
      "name": "param2",
      "message": "What is the value of param2"
    }, {
      "type": "input",
      "name": "param3",
      "message": "What is the value of param3"
    }
  ]
```

**NOTE: Is possible to disable all inquires using --disablePrompts on command line or including disablePrompts=true on any piscosour configuration way.**

See [inquirer library](https://www.npmjs.com/package/inquirer) for more information.

## Fields configuration

The fields to configure each parameter are:

### `type` field

This is the type of the prompt.

- (String|[Function](#function)) type is expected
- Optional. Default is `input`
- Possible values: `input`, `confirm`, `list`, `rawlist`, `expand`, `checkbox`, `password`, `editor`

### `name` field

Name of the this new prompt.

- String type is expected.
- Mandatory

### `message` field

The question to print. If defined as a [function](#function), the first parameter will be the current inquirer session answers.

- (String|[Function](#function)) type expected
- Mandatory

### `env` field

A environment variable name, if it exists it will get its value and not prompt to the user about it.

- String type expected
- Optional

### `required` field

If it an optional parameters or not.

- Boolean type expected
- Optional

### `default` field

Default value(s) to use if nothing is entered, or a [function](#function) that returns the default value(s). If defined as a function, the first parameter will be the current inquirer session answers.

- (String|Number|Array|[Function](#function)) type expected
- Optional

### `choices`

Choices array or a [function](#function) returning a choices array. If defined as a [function](#function), the first parameter will be the current inquirer session answers. Array values can be simple strings, or objects containing a name (to display in list), a value (to save in the answers hash) and a short (to display after selection) properties. The choices array can also contain a Separator.

- (Array|[Function](#function)) type expected
- Optional

### `validate` field

Receive the user input and should return true if the value is valid, and an error message (String) otherwise. If false is returned, a default error message is provided.

- [Function](#function) type expected

### `filter` field

Receive the user input and return the filtered value to be used inside the program. The value returned will be added to the Answers hash.

- [Function](#function) type expected

### `when` field
Receive the current user answers hash and should return true or false depending on whether or not this question should be asked. The value can also be a simple boolean.

([Function](#function), Boolean) type expected

### `pageSize` field

Change the number of lines that will be rendered when using list, rawList, expand or checkbox.

- Number type expected


## <a name="function"></a>Function type

With the prefix `#` and followed by a function name (`#functionName`), it is possible to assign functions to some fields (`check`, `validate`, `choices`, ...)

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

Then in a step:

```javascript
module.exports = {
  randomMessage: function() {
    const randomChoice = arr => {
      const randIndex = Math.floor(Math.random() * arr.length);
      return arr[randIndex];
    };
    return randomChoice([
      'Lorem Ipsum',
      'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet',
      'consectetur',
      'adipisci velit']);
  }
}
```

Will return a random message to the User:

```
$ recipe-sample-randomMessage ::testRandomMessage
[15:10:51] Execution contexts: [ contextTest ]
[15:10:52] 

 Starting | testRandom | [ contextTest::testRandomMessage ] 

? Neque porro quisquam est qui dolorem ipsum quia dolor sit amet 
```
