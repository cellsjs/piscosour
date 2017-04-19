---
title: Contexts
layout: doc_page.html
order: 1
---

# Contexts

The `contexts` define ***where*** and ***when*** pisco can be executed.

Contexts are implemented with three files in the recipe:

```
-rwxr-xr-x    1 pisco  staff   contexts/context-name/config.json
-rwxr-xr-x    1 pisco  staff   contexts/context-name/index.js
-rwxr-xr-x    1 pisco  staff   contexts/context-name/info.md
```

Where the `config.json` file has the configuration, `info.md` explains and documents the context, and `index.js` has the implementation of the context.

Note, it exists a [scaffold generator tool](#scaffold)

## `config.json` configuration

The `config.json` file has the definition of the context:

```json
{
  "name": "context-name",
  "description": "A description of context-name"
}
```

The contexts are described by two fields:

### `name` property

A short name for the context, it should be descriptive and unique.

- It is mandatory
- String type expected

### `description` property

It is a short description about the context.

- It is mandatory
- String type expected

## `index.js` implementation

The `index.js` file implements a `check()` function which defines the context. Please, replace it with the following content:

```javascript
'use strict';
const path = require('path');
const process = require('process');

const _isWorldFolder = function() {
  let dir = process.cwd().split(path.sep);

  return dir[dir.length - 1] === 'world';
};

module.exports = {
  check() {
    return _isWorldFolder();
  }
};
```

## Testing
If we want to test this functionality, we simply create the following file:

```javascript
"use strict";

/* global define, it, describe, before */
const assert = require('assert');
const contextWorld = require("../contexts/world/index.js");

describe("Verify the current folder with the step", () => {
    const currentDirectory = process.cwd();
    it("Should return KO because folder is not world, is test", () => {
        //Arrange
        //Act
        const isWorld = contextWorld.check();
        //Assert
        assert.ok(!isWorld, "Folder is not world");
    });
    it("Should return OK because folder is world", () => {
        //Arrange
        process.chdir("test/world");
        //Act
        const isWorld = contextWorld.check();
        //Assert
        assert.ok(isWorld, "Folder is not world");
    });
    afterEach("Get back to the correct directory", () => {
        process.chdir(currentDirectory);
    });
});
```
In this case we are testing the code  we recently made. But what of we want to test the functionality? We have made a functional test for that:

## Functional testing
For the functional test we are going to think like pisco will do. How can pisco know wath context is involved in his operations? Pisco has an option (pisco -c) that tells you what are the contexts in the stacke. So let's do it ourselves:

```javascript
"use strict";

/* global define, it, describe, before */
const expect = require('chai').expect;
const exec = require('child_process').exec;

describe('Pisco context world validation', function () {
    it('Should return the context world', (done) => {
        exec('pisco -c', {
            cwd: 'test/world'
        }, (error, stdout, stderr) => {
            expect(error).to.equal(null);
            expect(stderr).to.equal('');
            expect(stdout).contain('world');
            done();
        });
    });
    it('Should return the context world', (done) => {
        exec('pisco -c', {
            cwd: 'test/notworld'
        }, (error, stdout, stderr) => {
            expect(error).to.equal(null);
            expect(stderr).to.equal('');
            expect(stdout).not.contain('world');
            done();
        });
    });
});

```
In this scenario we are testing the two possible cases for this context validation: you are in the world context or you are not.

## Documentation

The `info.md` file just explain the context with a markdown format:


```markdown
# Context context-name

The description about the context.
```

## <a name="scaffold"></a>Scaffold generator

Pisco provides a scaffold generator. You can launch it by executing these commands:

```sh
$ cd your-recipe
$ pisco recipe:add-context
```
