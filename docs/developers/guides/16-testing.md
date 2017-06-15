---
title: Testing
layout: doc_page.html
order: 16
---

# Testing Piscosour

There are to ways to test piscosour recipes: `unit testing` and `functional testing (integration)`. Both could be functional but the main different is `unit testing` runs as a node library inside the test and `functional testing (integration)` runs the recipe as a system executable using require('child_process').exec.

1. [Unit Testing](#unitTesting)
1. [Functional Testing (integration)](#functionalTesting)

## <a name="unitTesting"></a> Unit testing

1. [Testing steps](#testingSteps)
1. [Testing plugins](#testingPlugins)
1. [Testing contexts](#testingContexts)

Needed to test `steps`, `plugins` (coming soon) and `contexts` (coming soon)

- This tests resides on the `test` folder of a recipe module.
- Only need the recipe to be tested and its dependencies.
- Could generate coverage with this king of tests


### <a name="testingSteps"></a> Testing steps

Steps only needs dependency to piscosour on devDependencies. Add dependencies to mocha and chai too.

`NOTE:` If you need a context definition for the step execution the dependency to the context has to be on devDependencies too. for exemple `pisco-cells-contexts`

package.json:

```json
{
  "...":"...",
  "scripts": {
    "deps": "npm install",
    "test": "node_modules/.bin/mocha -u tdd --recursive"
  },
  "devDependencies": {
    "chai": "*",
    "mocha": "*",
    "piscosour": "^1.0.0"
  },
  "...":"..."
}

```

Writing a test for piscosour. First require stepTester
 
```javascript
 const tester = require('piscosour/lib/tests/stepTester');
```

- [command object](#command)

1. [setLoggerLevel(level) method](#setLoggerLevel)
1. [loadStep(command) method](#loadStep)
1. [runStep(command) method](#runStep)

#### <a name="command"></a>command object.

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| name | String | No | The name of the step  |
| context | Array | Yes | Array of the contexts runned |
| baseDir | String | Yes | Folder where the step is going to be runned. Default is the root of the recipe. |
| params | Object | Yes | All params passed for the execution |

Is the configuration parameter that piscosour use to run the test.

#### <a name="setLoggerLevel"></a>setLoggerLevel(level) method

`logger.setLoggerLevel(level)` set logger level for piscosour. [See logger for more information](./14-logger.md)

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| level | Number | No | 0...5 log levels  |

#### <a name="loadStep"></a>loadStep(command) method

`logger.loadStep(command)` Load local step with all plugins and all piscosour configuration. **Returns** step object with all piscosour features loaded.

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| command | Object | No | See [command object](#command) |


#### <a name="runStep"></a>runStep(command) method

`logger.runStep(command)` Run one local step from the recipe. **Returns** a promise with the execution of the step.

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| command | Object | No | See [command object](#command) |

This is a example of a entire test file.
 
```javascript
'use strict';

const path = require('path');
const tester = require('piscosour/lib/tests/stepTester');
const expect = require('chai').expect;
const assert = require('assert');

/* global define, it, describe, before, beforeEach, afterEach, after */

// configure

tester.setLoggerLevel(0);

// constants

const stepName = 'askHello';
const contexts = ['world'];
const message = 'Unit Framework hola!';

describe('Unit testing framework for askHello step', () => {
  it('Should return the step to test', (done) => {
    const step = tester.loadStep({
      name: stepName,
      context: contexts
    });
    expect(step).not.equal(null);
    expect(step.name).to.equal(stepName);
    done();
  });
  it('Should run the step to test', (done) => {
    tester.setLoggerLevel(0);
    tester.runStep({
        name: stepName,
        context: contexts,
        baseDir: path.join(__dirname, 'world'),
        params: {
          paramInquire: message
        }
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      })
  });
  it('Should run the step with plugins to test', (done) => {
    tester.setLoggerLevel(0);
    tester.runStep({
        name: 'emittingHello',
        context: contexts,
        baseDir: path.join(__dirname, 'world'),
        params: {
          paramInquire: message
        }
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      })
  });
});

```

### <a name="testingPlugins"></a> Testing plugins
(comming soon)
### <a name="testingContexts"></a> Testing contexts
(comming soon)

## <a name="functionalTesting"></a> Functional testing (integration)

1. [Configure the recipe](#configureRecipe)
1. [Writing tests](#writeTest)
1. [Running tests](#runningTest)


- Is used to test only recipes by executing externally all its commands.
- Is possible to tests `flows` and `steps`.
- Execute the recipe command so a configured environment is needed.
- Tests resides on a external module outside the recipe. Test modules has to be dependencies of the recipe.


### <a name="configureRecipe"></a> Configuring the recipe for testing

1. Add "test" : "bin/pisco.js -ft" to scripts in package.json.
1. Add dependencies to one or more functional-testing modules.  

package.json of a recipe.

```json
{
  "scripts": {
    "deps": "npm install",
    "test": "bin/pisco.js -ft"
  },
  "keywords": [
    "piscosour-recipe"
  ],
  "bin": {
    "cells": "bin/pisco.js"
  },
  "dependencies": {
    "piscosour": "^1.1.0"
  },
  "devDependencies": {
    "cells-cli-functional-tests": "^1.0.1-beta"
  },
  "...":"..."
}

```

### <a name="writeTest"></a> Writing the tests (the functional testing module)

- Has to have `functional-tests` keyword
- Dependencies to testing frameworks have to be on dependencies not on devDependencies
- Dependency to piscosour is not necessary.

package.json of the functional testing module:

```json
{
  "...":"...",
  "keywords": [
    "functional-tests"
  ],
  "dependencies": {
    "chai": "*",
    "mocha": "*"
  },
  "...":"..."
}
```

Now tests must execute the command `piscoExec` that is inject as a environment variable.

This is an example of tests that we can write. This test tests the creation of an app using cells-cli recipe.

```javascript
'use strict';

const pctp = require('pisco-callback-to-promise');
const u = require('../utils');

const fs = require('fs-extra');
const path = require('path');
const exec = require('child_process').exec;

/* global define, it, describe, before, beforeEach, afterEach, after */

// constants

const baseApp = `${__dirname}/../tmp`;

// ---- Tests --------

describe('Run cells app:create', function() {

  const allOk = '[ create ] finished';
  this.timeout(6000);

  it(`Should create a list of apps and say "${allOk}" on all apps`, function(done) {
    pctp.c2p(fs.ensureDir, baseApp)
      .then(() => pctp.c2p(exec, `${process.env.piscoExec} app:create --scaffoldDir scaffold --appName test-app`, {cwd: baseApp}))
      .catch((err) => pctp.logError(err, done));
  });
  afterEach('Should delete the tmp directory', (done) => {
    u.remove([ baseApp ])
      .then(() => done());
  });
});
```

lets see this example:

- Note that executable is a env variable: `process.env.piscoExec`
- We are using pctp module that converts callbacks to promises.

### <a name="runningTest"></a> Running functional tests

- From the recipe just with `npm test` or `bin/pisco.js -ft`
- In the functional testing module just executing mocha. First is needed to export the piscoExec parameter to environment:

```bash
export piscoExec="node /Users/sbonacho/projects/cells-cli/bin/pisco.js"
mocha -u tdd --recursive test --timeout 5000 --grep "Unit testing framework for askHello step"
```

`NOTE:` Is possible to test docker by changing piscoExec value:

```bash
export piscoExec="docker run -ti --rm -p 8000-8100:8000-8100 -p 3000-3100:3000-3100 -v ~/.gradle:/home/pisco/.gradle -v ~/.bowerrc:/home/pisco/.bowerrc -v ~/.npmrc:/home/pisco/.npmrc -v ~/.netrc:/home/pisco/.netrc -v ~/.ssh:/home/pisco/.ssh -v `pwd`:/home/pisco/workspace piscosour/cells-bundle"
```

The execution of pisco -ft or pisco --functionalTests starts with this messages on stdout. Showing the number of functional testing modules in the recipe, its names and versions.

```bash

[14:32:49] Number of functional testing modules detected:  1
[14:32:49] Executing piscosour functional tests from pisco-functional-tests ( 1.0.15 )


  Pisco context world validation
    ✓ Should return ....

```