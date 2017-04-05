---
title: Get Started
layout: doc_page.html
order: 2
---

# Installation

Install with [npm](https://npmjs.org) globally

```bash
$ npm install -g piscosour
```

# Getting Started

Please follow these instructions if you want to create your first recipe:

1. [Create a new recipe](#install)
2. [Add a context `world`](#add-context)
3. [Add the step `sayHello`](#add-step)
4. [Add a flow `hello`](#add-flow)
5. [Launch the new command `recipe-sample`](#launch)
6. [Test it](#test)

## <a name="install"></a>1. Create a new recipe

Launch `pisco` and select `recipe:create` option.

```
$ pisco
? What's up!? (Use arrow keys)
❯ recipe:create (Create new recipe from scratch) 
  More commands 
  Get help 
  Exit 
```

Or execute directly the flow `recipe:create`.

```
$ pisco recipe:create
```

If it is the first time to execute `recipe:create`, wait until the npm package called `pisco-recipe-generator` will be installed.

Then you must fill the questions inquired:

- Name: `pisco-sample`
- A short description of your recipe: `My first recipe`
- Command Line name: `recipe-sample`
- An included build integration file: `none`

```
 Starting | Create a recipe scaffold | [ recipe::recipe-create ] 

? Recipe name pisco-sample
? Recipe description My first recipe
? Recipe command line name recipe-sample
? Recipe Continuous Integration File none
```

Next it will generate a new recipe called `pisco-sample`

```
[17:23:32] run stage running...
[17:23:32] 
                                   
                                        &  &&%%%%%%%%%%%%%%%  
                                    /*  &                   
        .%&&&&                     &  &                     
     &&    &&/   %&(              &  &                      
   &&  .  &      &  &           &  .,                       
  &/,  #     &  (  & &%        &  &                         
 && #    & &  &    /  &       %  &                          
 & %     &&& &&,      &&&&&&&  &                            
 &/ & &&  &.&&  ..& &    &  &    &,                         
  & &   *  % * &      &&&&&&&&&&&   &                       
  ,&  /      (   &/ .&             ,                        
    && %.%&   & &  &&              &                        
      &&(.     &&&                 &                        
            &                      &                        
            &                      &                        
           (                        %                       
           &                        &                       
          &                          &                      
          &                          &                      
         ./         PISCOSOUR        ./                     
         &                            &                     
         &                            &                     
          (                          %.                     
          &                          &                      
           &                        %                       
            &&                    #&                        
              &&&              %%&                          
                (&&&&&&&&&&&&&%&                            
                   &        %.                              
                     &    %                                 
                     *    &                                 
                      ,                                     
                      &  *                                  
                      %  ,                                  
                                                            
                     &    &                                 
                    &  ..  &                                
               %.               &                           
               &&              &&                           
                  &&&&&&&&&&&&                              
[17:23:33] 

 Finished | Create a recipe scaffold - 34 s 276 ms 

[17:23:33] Flow [ create ] finished - 34 s 418 ms
[17:23:33] Total time - 34 s 420 ms
```

A new folder `pisco-sample` has been created with the following content:

```
-rw-r--r--    1 pisco  staff   .gitignore
-rw-r--r--    1 pisco  staff   README.md
drwxr-xr-x    3 pisco  staff   bin
-rwxr-xr-x    1 pisco  staff   bin/pisco.js
-rw-r--r--    1 pisco  staff   package.json
-rw-r--r--    1 pisco  staff   piscosour.json
drwxr-xr-x    3 pisco  staff   test
-rw-r--r--    1 pisco  staff   test/index.js
```

This receipt is npm package, empty, to make it run needs a `context`, a `step` and a `flow`.

## <a name="add-context"></a>2. Add a context `world`

The context defines **where** could a step be executed. In this sample, the step `sayHello` just runs inside a folder called `world`.

So, in the new folder `pisco-sample`, add a flow launching `pisco` and the action `add-context`.

```
$ pisco    
? What's up!? Choose an action for a recipe 
❯ recipe:add-context (Add a context to a piscosour recipe) 
  recipe:add-flow (Add a flow to a piscosour recipe) 
  recipe:add-step (Add a step to a piscosour recipe) 
  More commands 
  Get help 
  Exit 
```

Then fill the parameters needed to create the flow:
- Name of the context: world
- Description for the context: Check if current working directory is world

```
? What's up!? Choose an action for a recipe recipe:add-context (Add a context to a piscosour recipe)
[19:21:27] Execution contexts: [ recipe ]
[19:21:27] Starting flow: [ add-context ], steps: [ add-context ]
[19:21:27] 

 Starting | Generator to add a new context | [ recipe::add-context ] 

? Name of the context world
? Description for the context Check if current working directory is world
[19:31:14] run stage running...
[19:31:14] 

 Finished | Generator to add a new context - 09 m 46 s 996 ms 

[19:31:14] Flow [ add-context ] finished - 09 m 47 s 172 ms
[19:31:14] Total time - 09 m 47 s 174 ms
```

And a new folder called `contexts/world` has been created.

```
-rwxr-xr-x    1 pisco  staff   contexts/world/config.json
-rwxr-xr-x    1 pisco  staff   contexts/world/index.js
-rwxr-xr-x    1 pisco  staff   contexts/world/info.md
```

The `config.json` file has the configuration of the context:

```json
{
  "name": "world",
  "description": "Check if current working directory is world"
}
```

The `index.js` file implements a `checks` function which implements the context. Please, replace it with the following content:

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

The `info.md` file is just to explain the context:

```markdown
# Context world

Check if current working directory is world
```

## <a name="add-step"></a>3. Add the step `sayHello`

To create the step, please go to the root of the receipt and execute the command `pisco add-step`:

```
$ pisco    
? What's up!? Choose an action for a recipe 
  recipe:add-context (Add a context to a piscosour recipe) 
  recipe:add-flow (Add a flow to a piscosour recipe) 
❯ recipe:add-step (Add a step to a piscosour recipe) 
  More commands 
  Get help 
  Exit 
```

And fill the parameters needed to create the flow:
- Name of the step: `sayHello`
- Description for the step: `Say Hello World`
- Is a generator: `No`
- List of contexts separated by commas: `world`
- List of plugins separated by commas: ***leave empty***

```
$ pisco
? What's up!? Choose an action for a recipe recipe:add-step (Add a step to a piscosour recipe)
[20:38:18] Execution contexts: [ recipe ]
[20:38:18] Starting flow: [ add-step ], steps: [ add-step ]
[20:38:18] 

 Starting | Generator to add a new step | [ recipe::add-step ] 

? Name of the step sayHello
? Description for the step Say Hello World
? Is a generator? (if the step creates the context) No
? List of contexts separated by commas (recipe, app, component, ...) world
? List of plugins separated by commas (plugin1, plugin2) 
[20:39:16] run stage running...
[20:39:17] 

 Finished | Generator to add a new step - 58 s 643 ms 

[20:39:17] Flow [ add-step ] finished - 58 s 785 ms
[20:39:17] Total time - 58 s 787 ms
```

Then, there are new files:

```
-rw-r--r--  1 pisco  staff  ./steps/sayHello/config.json
-rw-r--r--  1 pisco  staff  ./steps/sayHello/index.js
-rw-r--r--  1 pisco  staff  ./steps/sayHello/info.md
```

The `config.json` file has the configuration, `info.md` explain and document the step, and `index.js` has the implementation of the step, please replace it with:

```javascript
'use strict';

module.exports = {
  run: function(ok, ko) {
    this.sh('echo HELLO WORLD', ko, true);
    return;
  }
};
```

Note that with `this.sh` you are able to lauch any command of the operating system.

## <a name="add-flow"></a>4. Add a flow `hello`

Finally, add a flow with the step `sayHello`. So, please, placed inside the folder `pisco-sample`, add a flow launching `pisco` and the action `add-flow`

```
$ pisco    
? What's up!? Choose an action for a recipe 
  recipe:add-context (Add a context to a piscosour recipe) 
❯ recipe:add-flow (Add a flow to a piscosour recipe) 
  recipe:add-step (Add a step to a piscosour recipe) 
  More commands 
  Get help 
  Exit 
```

And fill the parameters needed to create the flow:
- Name of the flow: `hello`
- Description for the flow: `Hello World sample flow`
- Is a generator: `No`
- List of steps separated by commas: `sayHello`

```
$ pisco
? What's up!? Choose an action for a recipe recipe:add-flow (Add a flow to a piscosour recipe)
[11:25:32] Execution contexts: [ recipe ]
[11:25:32] Starting flow: [ add-flow ], steps: [ add-flow ]
[11:25:32] 

 Starting | Generator to add a new flow | [ recipe::add-flow ] 

? Name of the flow hello
? Description for the flow Hello World sample flow
? Is a generator? (if the flow creates the context) No
? List of steps separated by commas sayHello
[11:25:52] run stage running...
[11:25:52] 

 Finished | Generator to add a new flow - 20 s 072 ms 

[11:25:52] Flow [ add-flow ] finished - 20 s 298 ms
[11:25:52] Total time - 20 s 301 ms
```

Well, a new directory `flows` has been created:

```
-rw-r--r--  1 pisco  staff  ./flows/hello/config.json
-rw-r--r--  1 pisco  staff  ./flows/hello/info.md
```

The configuration of the flow is in the `config.json` file:

```json
{
  "name": "hello",
  "description": "Hello World sample Flow",
  "isGenerator": false,
  "steps": {
    "sayHello": {}
  }
}
```

## <a name="launch"></a>5. Launch the new command `recipe-sample`

Done! A new folder called `pisco-sample` has been created.

Then you can test the new command in two different ways:

With [`npm link`](https://docs.npmjs.com/cli/link) the new package is linked globally, and then execute the new command:

```
$ cd pisco-sample
$ npm link
$ mkdir test/world && cd test/world
$ recipe-sample
? What's up!? Choose an action for a world (Use arrow keys)
❯ world:hello (Hello World sample flow) 
  More commands 
  Get help 
  Exit 
```

Select `world:hello` operation:

```
? What's up!? Choose an action for a world world:hello (Hello World sample flow)
[21:04:32] Execution contexts: [ world ]
[21:04:32] Starting flow: [ hello ], steps: [ sayHello ]
[21:04:32] 

 Starting | Say Hello World | [ world::sayHello ] 

[21:04:32] run stage running...
HELLO WORLD
[21:04:32] 

 Finished | Say Hello World - 009 ms 

[21:04:32] Flow [ hello ] finished - 024 ms
[21:04:32] Total time - 026 ms
```

## <a name="test"></a>6. Test it

There is some tests built with [mocha](https://mochajs.org) and [chai](https://chaijs.com), in the folder `test/`.

If you want to run the tests, simply execute:

```sh
$ npm test
```

Step will fail until you update `test/step-sayHello.js` with the content:

```javascript
'use strict';
/* global define, it, describe, before */
const expect = require('chai').expect;
const exec = require('child_process').exec;

describe('::sayHello validation', function() {
  this.timeout(5000);
  it('Should \'::sayHello\' works', (done) => {
    exec('node ../.. ::sayHello', { cwd: 'test/world' }, (error, stdout, stderr) => {
      expect(error).to.equal(null);
      expect(stderr).to.equal('');
      expect(stdout).contain('HELLO WORLD');
      done();
    });
  });
});
```
