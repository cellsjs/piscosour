---
title: Parameters
layout: doc_page.html
order: 5
---

# Parameters

In the [step](./02-steps.md) implementation, parameters are available with `this.params`.

Example:

```javascript
module.export = {
  run: function() {
    console.log(
      this.params.param1,
      this.params.param2,
      this.params.param3);
  }
}
```

Below are the available methods to fill parameters values:

1. [External file configuration](#file)
1. [Command line paramaters option](#cli)
1. [Working Directory `.piscosour/piscosour.json` file configuration](#piscosour-json)
1. [Receipt `.piscosour/piscosour.json` file configuration](#piscosour-json)
1. [Flow `config.json` file configuration](#flow)
1. [Step `config.json` file configuration](#step)
1. [User inquire - interactive way](#interactive)

This is the priority order (from high to low), if a parameter is provided twice or more, with different values, then it will stay the value that is above in the list.

The **effective configuration** has the merge from all methods and applying this above priority. The **effective configuration** could be inquired with `-ov` parameters over the recipe or `pisco` command:

```sh
$ recipe-name -ov
$ pisco -ov
```
The functional tests ffor this feature of pisco can be found in the [pisco-functional-tests/test/parameters-functional-test.js][1] file.

## <a name="file"></a>1. External file configuration

The second method to provide parameters is with an external json file.

```sh
$ pisco --paramsFile params.json
```

Where `params.json`, can be any name you choose for your own parameter file. 

This is very useful because you can provide complex parameters like objects and arrays.

An example of a parameter file is:
```json
{
  "param1": "value1",
  "param2": {
    "p1": "v1",
    "p2": "v2"
  },
  "param3": [1, 2, 3]
 }
```

Where:
- `param1` is a simple `String`
- `param2` is an `Object`
- `param3` is an `Array`

It is important to say that all the  Objects defined in this file will overwrite other objects definitions. For example, if we have this configuration in our external File:

```json
{
  "firstPriority": "externalFile",
  "secondPriority": "commandLine",
  "priorityOrder": {
    "thirdPriority": "workingDir.piscosour/piscosour.json"
  }
}
```

And in our step config we adjust some parameters as follows:

```json
{
  "firstPriority": "piscosour.json - Recipe",
  "secondPriority": "piscosour.json - Recipe",
  "priorityOrder": {
    "thirdPriority": "piscosour.json - Recipe",
    "fourthPriority": "piscosour.json - Recipe"
  }
}
```
We expect that our params result in the merged object:

```json
{
  "firstPriority": "externalFile",
  "secondPriority": "commandLine",
  "priorityOrder": {
    "thirdPriority": "workingDir.piscosour/piscosour.json",
     "fourthPriority": "piscosour.json - Recipe"
  }
}
```
But instead, paramsFile will overwrite the entire object, remaining


```json
{
  "firstPriority": "externalFile",
  "secondPriority": "commandLine",
  "priorityOrder": {
    "thirdPriority": "workingDir.piscosour/piscosour.json"
  }
}
```

## <a name="cli"></a>2. Command line parameters option

Each recipe can be executed with a list of parameters with the following syntax:

```sh
$ pisco-recipe --param1 value1 --param2 value2 --param3 value3 ...
```

For example in a step implementation, this will return "value1, value2, value3":

```javascript
module.export = {
  run: function() {
    console.log(
      this.params.param1,
      this.params.param2,
      this.params.param3);
    // shows "value1, value2, value3"
  }
}
```

## <a name="piscosour-json"></a>3. Working Directory `.piscosour/piscosour.json` file configuration

Another method to provide parameters is to create in the working directory where it is going to execute the recipe a folder `.piscosour` with a file called `piscosour.json`:

```
[CurrentWorkingDirectory]/.piscosour/piscosour.json
```

Check [`piscosour.json` parameters syntax](./11-configuration.md#parameters) for more information and examples.

## <a name="piscosour-json"></a>4. Receipt `piscosour.json` file configuration

You can also provide parameters editing in your receipt the file called `piscosour.json`:

```
[recipeRoot]/piscosour.json
```

Check [`piscosour.json` parameters syntax](./11-configuration.md#paramaters) for more information and examples.

## <a name="flow"></a>5. [Flow](./03-flows.md) `config.json` file configuration

This file is placed in:

```
[recipeRoot]/flows/[flowName]/config.json
```

See [flows parameters definition](./03-flows.md#parameters) for more information.

## <a name="step"></a>6. [Step](./02-steps.md) `config.json` configuration

This file is placed in:

```
[recipeRoot]/steps/[stepName]/config.json
```

See [flows parameters definition](./02-steps.md#parameters) for more information.

## <a name="interactive"></a>7. User inquire - interactive way

[Inquire](./06-inquire.md) to the user, about the values with the `prompts` configuration.

Example:

In a step `steps/stepName/config.json`

```json
{
  "name": "stepName",
  "description": "step Name",
  "contexts": [
    "contextName"
  ],
  "prompts": [
    {
      "type": "input",
      "name": "param1",
      "required" : true,
      "message": "Value of param1",
      "default" : "value1"
    }
  ]
}
```

Will ask to the user for `param1`:

```
[12:16:55] Execution contexts: [ recipe ]
[12:16:55] 

 Starting | prueba | [ recipe::prueba ] 

? Value of param1 (value1) 
```

Please see [Inquire](./06-inquire.md) for more information.

[1]: https://github.com/cellsjs/pisco-functional-tests/blob/feature/QPA-33-functional-tests/test/parameters-functional-test.js
