[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

![Piscosour: Get all your devops tools wrapped-up!](doc/images/logo.png)

# What is Piscosour?

- Piscosour gets all command line (CLI) development tools wrapped-up, creating ascertainable command line workflows. 
- Piscosour does not replace other tools, coexists with all of them and allows the best symbiosis of them all.
- Piscosour shots are easy and reusable components based on a npm dependency. 
- Piscosour execution creates an easily junit.xml filed to manage with the most popular orchestrators like Jenkins, Hudson, Bamboo, etc.
- Piscosour keeps all sets of tools ordered under the same recipe, so you could have recipes for polymer, AngularJS, react, facilities, system utilities ... and use them in any workflow you need.

We have moved the idea of a component to use it as a tool to build, to test, to use in a continuous integration tool, etc. For all these tasks we have created Piscosour.

**To get an idea, it’s a command line jenkins, bamboo, travis or gocd , which allows better reuse of workflows.** 

Piscosour wraps the functionality of any tool and helps you to:

1. localize.
2. documenting.
3. share.
4. trust.
5. test.
6. versioning.
7. watch the life cycle.
8. watch results

 of all bash scripts, gulp and grunt tasks, yeoman generators, hydrolysis, lint/eslint, polymer tools, cordova tools, sass,  etc.

So, you can use all your favorites tools keeping it under control and versioned.

# Documentation

* [Complete documentation](doc/README.md) - Complete documentation, howtos, api, examples...
* [Spanish documentation](doc/spanish/README.md) - Spanish documentation for piscosour.

# Main Index:

- User Commands
    - [component::demo-tests (Cells component demo testing)](#componentdemo-tests-cells-component-demo-testing)
    - [component::lint (Cells components linter)](#componentlint-cells-components-linter)
    - [component::unit-tests (Cells component unit tests execution and coverage analysis)](#componentunit-tests-cells-component-unit-tests-execution-and-coverage-analysis)
    - [component:validate (Cells components validation flow for Bamboo)](#componentvalidate-cells-components-validation-flow-for-bamboo)
- [All Commands Availables](#all-commands-availables)
    - from **cells-component-ci  v.0.2.7**
        - [component:validate (Cells components validation flow for Bamboo)](#componentvalidate-cells-components-validation-flow-for-bamboo)
    - from **piscosour  v.1.0.0-alpha.7**
        - [node-module:convert (Convert any module into a piscosour recipe)](#node-moduleconvert-convert-any-module-into-a-piscosour-recipe)
        - [recipe:add-flow (Add a flow to a piscosour recipe)](#recipeadd-flow-add-a-flow-to-a-piscosour-recipe)
        - [recipe:add-step (Add a step to a piscosour recipe)](#recipeadd-step-add-a-step-to-a-piscosour-recipe)
        - [recipe:config (Manage a piscosour recipe)](#recipeconfig-manage-a-piscosour-recipe)
        - [recipe:create (Create new recipe from scratch)](#recipecreate-create-new-recipe-from-scratch)
        - [recipe:docs (Append documentation from info.md to readme.md of the recipe)](#recipedocs-append-documentation-from-infomd-to-readmemd-of-the-recipe)
        - [all::npm (DEPRECATED)](#allnpm-deprecated)
        - [node-module::convert (Convert any nodejs module into a piscosour recipe)](#node-moduleconvert-convert-any-nodejs-module-into-a-piscosour-recipe)
        - [recipe::add-flows (Adding step to a flow)](#recipeadd-flows-adding-step-to-a-flow)
        - [recipe::add-steps (Create new pisco step inside this module)](#recipeadd-steps-create-new-pisco-step-inside-this-module)
        - [recipe::configure (Configure piscosour.json)](#recipeconfigure-configure-piscosourjson)
        - [recipe::generate-docs (Generate one file per flow inside a directory)](#recipegenerate-docs-generate-one-file-per-flow-inside-a-directory)
        - [recipe::scaffolding (Create a piscosour recipe from a scaffold template)](#recipescaffolding-create-a-piscosour-recipe-from-a-scaffold-template)
        - [recipe::update (Update tool)](#recipeupdate-update-tool)
        - [recipe::yeah (Brief description of step)](#recipeyeah-brief-description-of-step)
    - from **pisco-cells-component-demo-tests  v.0.2.4**
        - [component:demo-tests (Cells component demo tests execution)](#componentdemo-tests-cells-component-demo-tests-execution)
        - [component::demo-tests (Cells component demo testing)](#componentdemo-tests-cells-component-demo-testing)
    - from **pisco-cells-component-lint  v.0.3.6**
        - [component:lint (Cells components linter)](#componentlint-cells-components-linter)
        - [component::lint (Cells components linter)](#componentlint-cells-components-linter)
    - from **pisco-cells-component-unit-tests  v.0.2.2**
        - [component:unit-tests (Cells component unit tests execution and coverage analysis)](#componentunit-tests-cells-component-unit-tests-execution-and-coverage-analysis)
        - [component::unit-tests (Cells component unit tests execution and coverage analysis)](#componentunit-tests-cells-component-unit-tests-execution-and-coverage-analysis)
    - from **pisco-docker  v.0.3.1**
        - [recipe:dockerize (Generate Docker images and compose for a straw)](#recipedockerize-generate-docker-images-and-compose-for-a-straw)
        - [recipe::docker-base (Generate docker matrioska for recipe)](#recipedocker-base-generate-docker-matrioska-for-recipe)
        - [recipe::docker-command (Generate docker matrioska for command)](#recipedocker-command-generate-docker-matrioska-for-command)
        - [recipe::docker-compose (Generate docker-compose file for system dependencies)](#recipedocker-compose-generate-docker-compose-file-for-system-dependencies)
        - [recipe::docker-installations (Append all installations to Docker matrioska)](#recipedocker-installations-append-all-installations-to-docker-matrioska)
        - [recipe::docker-publish (Publishing all generated docker images)](#recipedocker-publish-publishing-all-generated-docker-images)
    - from **pisco-installer  v.0.1.5**
        - [all::install (Install repository)](#allinstall-install-repository)
- [Plugins](#plugins)
    - from **piscosour  v.1.0.0-alpha.7**
        - [context](#context)
        - [fsutils](#fsutils)
        - [inquirer](#inquirer)
        - [installer](#installer)
        - [launcher](#launcher)
        - [os](#os)
        - [piscosour](#piscosour)
        - [skipper](#skipper)
        - [stream-write-hook](#stream-write-hook)
        - [system-checker](#system-checker)
        - [system-saver](#system-saver)
        - [test](#test)
    - from **pisco-polyserve  v.0.1.1**
        - [polyserve](#polyserve)
    - from **pisco-selenium  v.0.1.0**
        - [selenium](#selenium)
    - from **pisco-eslint  v.0.1.0**
        - [eslint](#eslint)
    - from **pisco-docker  v.0.3.1**
        - [docker-chain](#docker-chain)
    - from **pisco-plugin-nunjucks  v.0.1.0**
        - [nunjucks](#nunjucks)
- [Contexts](#contexts)
- [Recipes](#recipes)



# All Commands Availables


###component:validate (Cells components validation flow for Bamboo)
[Go Index](#main-index):

How to execute this command:

    pisco component:validate




#### 1. component:install 'Install repository'
General info:

```
Contexts:  all
From: pisco-installer (0.1.5)
```
install the repository


#### 2. component:lint 'Cells components linter'
General info:

```
Contexts:  component
From: pisco-cells-component-lint (0.3.6)
```
Runs a lint validation on the source code of the component. It uses [ESLint](http://eslint.org/) as linter, applying a set of rules you can find in this [.eslintrc.json file](https://descinet.bbva.es/stash/projects/CTOOL/repos/cells-eslintrc/browse/.eslintrc.json).

Context: _component_


#### 3. component:unit-tests 'Cells component unit tests execution and coverage analysis'
General info:

```
Contexts:  component
From: pisco-cells-component-unit-tests (0.2.2)
```
Runs [web-component-tester](https://github.com/Polymer/web-component-tester) unit tests in the component. **If all the tests pass**, then it executes a code coverage analysis based on [istanbul](https://github.com/gotwarlost/istanbul).

Context: _component_


#### 4. component:demo-tests 'Cells component demo testing'
General info:

```
Contexts:  component
From: pisco-cells-component-demo-tests (0.2.4)
```
Runs a validation on the demo of the component. This validation consists of two tests:

- there is a **index.html** web page containing an instance of the `iron-component-page` element.

- there is a **demo/index.html** web page containing an instance of the component being tested.

**This validation is only executed when the target component is not a behavior.***

Context: _component_

###node-module:convert (Convert any module into a piscosour recipe)
[Go Index](#main-index):

How to execute this command:

    pisco node-module:convert




#### 1. node-module:convert 'Convert any nodejs module into a piscosour recipe'
General info:

```
Contexts:  node-module
From: piscosour (1.0.0-alpha.7)
```
shot convert

###recipe:add-flow (Add a flow to a piscosour recipe)
[Go Index](#main-index):

How to execute this command:

    pisco recipe:add-flow




#### 1. recipe:add-flows 'Adding step to a flow'
General info:

```
Contexts:  recipe
From: piscosour (1.0.0-alpha.7)
```
shot straws

###recipe:add-step (Add a step to a piscosour recipe)
[Go Index](#main-index):

How to execute this command:

    pisco recipe:add-step




#### 1. recipe:add-steps 'Create new pisco step inside this module'
General info:

```
Contexts:  recipe
From: piscosour (1.0.0-alpha.7)
```
shot shots

###recipe:docs (Append documentation from info.md to readme.md of the recipe)
[Go Index](#main-index):

How to execute this command:

    pisco recipe:docs


Command: **node bin/pisco.js recipe:docs**

Generate documentation for your recipe.

### How to write info.md

Info.md is a regular md file, so you can use all the markdown specification. The only thing that you have to be on mind is the use of titles. 
 
**Inside a info.md use title from third level and beyond**

#### 1. recipe:generate-docs 'Generate one file per flow inside a directory'
General info:

```
Contexts:  recipe
From: piscosour (1.0.0-alpha.7)
```
shot generate-docs


### all::npm 'DEPRECATED'
[Go Index](#main-index):

How to execute this command:

    pisco all::npm

General info:

```
Contexts:  all
From: piscosour (1.0.0-alpha.7)
```
#### Deprecated! Use requirements instead!

### node-module::convert 'Convert any nodejs module into a piscosour recipe'
[Go Index](#main-index):

How to execute this command:

    pisco node-module::convert

General info:

```
Contexts:  node-module
From: piscosour (1.0.0-alpha.7)
```
shot convert


### recipe::add-flows 'Adding step to a flow'
[Go Index](#main-index):

How to execute this command:

    pisco recipe::add-flows

General info:

```
Contexts:  recipe
From: piscosour (1.0.0-alpha.7)
```
shot straws


### recipe::add-steps 'Create new pisco step inside this module'
[Go Index](#main-index):

How to execute this command:

    pisco recipe::add-steps

General info:

```
Contexts:  recipe
From: piscosour (1.0.0-alpha.7)
```
shot shots


### recipe::configure 'Configure piscosour.json'
[Go Index](#main-index):

How to execute this command:

    pisco recipe::configure

General info:

```
Contexts:  recipe
From: piscosour (1.0.0-alpha.7)
```
shot piscosour


### recipe::generate-docs 'Generate one file per flow inside a directory'
[Go Index](#main-index):

How to execute this command:

    pisco recipe::generate-docs

General info:

```
Contexts:  recipe
From: piscosour (1.0.0-alpha.7)
```
shot generate-docs


### recipe::scaffolding 'Create a piscosour recipe from a scaffold template'
[Go Index](#main-index):

How to execute this command:

    pisco recipe::scaffolding

General info:

```
Contexts:  recipe
From: piscosour (1.0.0-alpha.7)
```
shot scaffolding


### recipe::update 'Update tool'
[Go Index](#main-index):

How to execute this command:

    pisco recipe::update

General info:

```
Contexts:  recipe
From: piscosour (1.0.0-alpha.7)
```
### Update version of recipe

This shot execute npm install -g **recipeName**. recipeName has to be in params._pkgName


### recipe::yeah 'Brief description of step'
[Go Index](#main-index):

How to execute this command:

    pisco recipe::yeah

General info:

```
Contexts:  recipe
From: piscosour (1.0.0-alpha.7)
```

###component:demo-tests (Cells component demo tests execution)
[Go Index](#main-index):

How to execute this command:

    pisco component:demo-tests




#### 1. component:demo-tests 'Cells component demo testing'
General info:

```
Contexts:  component
From: pisco-cells-component-demo-tests (0.2.4)
```
Runs a validation on the demo of the component. This validation consists of two tests:

- there is a **index.html** web page containing an instance of the `iron-component-page` element.

- there is a **demo/index.html** web page containing an instance of the component being tested.

**This validation is only executed when the target component is not a behavior.***

Context: _component_


### component::demo-tests 'Cells component demo testing'
[Go Index](#main-index):

How to execute this command:

    pisco component::demo-tests

General info:

```
Contexts:  component
From: pisco-cells-component-demo-tests (0.2.4)
```
Runs a validation on the demo of the component. This validation consists of two tests:

- there is a **index.html** web page containing an instance of the `iron-component-page` element.

- there is a **demo/index.html** web page containing an instance of the component being tested.

**This validation is only executed when the target component is not a behavior.***

Context: _component_

###component:lint (Cells components linter)
[Go Index](#main-index):

How to execute this command:

    pisco component:lint




#### 1. component:lint 'Cells components linter'
General info:

```
Contexts:  component
From: pisco-cells-component-lint (0.3.6)
```
Runs a lint validation on the source code of the component. It uses [ESLint](http://eslint.org/) as linter, applying a set of rules you can find in this [.eslintrc.json file](https://descinet.bbva.es/stash/projects/CTOOL/repos/cells-eslintrc/browse/.eslintrc.json).

Context: _component_


### component::lint 'Cells components linter'
[Go Index](#main-index):

How to execute this command:

    pisco component::lint

General info:

```
Contexts:  component
From: pisco-cells-component-lint (0.3.6)
```
Runs a lint validation on the source code of the component. It uses [ESLint](http://eslint.org/) as linter, applying a set of rules you can find in this [.eslintrc.json file](https://descinet.bbva.es/stash/projects/CTOOL/repos/cells-eslintrc/browse/.eslintrc.json).

Context: _component_

###component:unit-tests (Cells component unit tests execution and coverage analysis)
[Go Index](#main-index):

How to execute this command:

    pisco component:unit-tests




#### 1. component:unit-tests 'Cells component unit tests execution and coverage analysis'
General info:

```
Contexts:  component
From: pisco-cells-component-unit-tests (0.2.2)
```
Runs [web-component-tester](https://github.com/Polymer/web-component-tester) unit tests in the component. **If all the tests pass**, then it executes a code coverage analysis based on [istanbul](https://github.com/gotwarlost/istanbul).

Context: _component_


### component::unit-tests 'Cells component unit tests execution and coverage analysis'
[Go Index](#main-index):

How to execute this command:

    pisco component::unit-tests

General info:

```
Contexts:  component
From: pisco-cells-component-unit-tests (0.2.2)
```
Runs [web-component-tester](https://github.com/Polymer/web-component-tester) unit tests in the component. **If all the tests pass**, then it executes a code coverage analysis based on [istanbul](https://github.com/gotwarlost/istanbul).

Context: _component_

###recipe:dockerize (Generate Docker images and compose for a straw)
[Go Index](#main-index):

How to execute this command:

    pisco recipe:dockerize




#### 1. recipe:docker-base 'Generate docker matrioska for recipe'
General info:

```
Contexts:  recipe
From: pisco-docker (0.3.1)
```
### Generate base docker image of one recipe.

**Context:** Has to be executed inside a **recipe**.

Read package.json and piscosour.json of the recipe and generate a docker image.

- The name of the docker image is: **piscosour/recipe.cmd** (param cmd inside piscosour.json)
- Write temporary files Dockerfile, .dockerignore, .netrc, entrypoint.sh files from template inside template directory. 
- At the and of the execution temporary files are deleted!.

#### Parameters needed:

- username: Username used to generate .netrc.
- password: Password used to generate .netrc.
- fromImage: Image used in FROM inside Dockerfile.

#### emit: 

- image: Name and tag of the generated image.
- username: Username used to generate .netrc.
- password: Password used to generate .netrc.
- generated: push image to this.params.generated array (if exists) with all the images generated. 

#### 2. recipe:docker-command 'Generate docker matrioska for command'
General info:

```
Contexts:  recipe
From: pisco-docker (0.3.1)
```
### Generate command docker image from a command of a recipe.

**Context:** Has to be executed inside a **recipe**.

Read package.json and piscosour.json of the recipe ask for the command to be generated and execute this commands:

- Execute {recipe.cmd} --pstage core-check --b-neverStop inside the docker image. This autoinstall all npm dependencies inside the docker image.
- Write a entrypoint.sh script inside the docker image to be used as entrypoint of image: --b-disableSystemCheck --uuid {{ uuid }} this params are added to all commands command execute by this docker image.
- Checks if the version of the command 'docker run...' is the same of the introduced verson (using docker-chain plugin).
- Write temporary files Dockerfile, .dockerignore, .netrc, entrypoint.sh files from template inside template directory. 
- At the and of the execution temporary files are deleted!.

#### Parameters needed:

- username: Username used to generate .netrc.
- password: Password used to generate .netrc.
- fromImage: Image used in FROM inside Dockerfile.
- command: Command to be dockerize.
- uuid: used in google analytics. 

#### emit: 

- image: Name of the docker image generated.
- version: Used to tag docker image. 
- generated: push image to this.params.generated array (if exists) with all the images generated.

#### 3. recipe:docker-installations 'Append all installations to Docker matrioska'
General info:

```
Contexts:  recipe
From: pisco-docker (0.3.1)
```
### Improve the docker image of a command with all the requirements inside its shots 

**Context:** Has to be executed inside a **recipe**.

- Execute 'docker run -v `${process.cwd()}:/home/pisco/workspace` {fromImage} --pstage core-check --b-saveRequirements --b-disableSystemCheck' to get the **'requirements.json'** file.
- Install all system dependencies written inside requirements.json from Dockerfiles (*)  
- Write temporary files Dockerfile, .dockerignore, .netrc, entrypoint.sh files from template inside template directory. 
- At the and of the execution temporary files are deleted!.

#### Dockerfiles repository

System dependencies are resolved using:
 
 1. 'dockerfile' folder inside any recipe of the dependencies inside package.json of dockersour recipe.
 2. NOTE that .piscosour/dockerfiles directory can be use as Dockerfiles repository. So is posible to use this to write addhoc Dockerfiles.
 3. NOTE: We recomend to write general Dockerfile in order to be reused in other recipes.
  
For example: if we have a requirement written in a params.json of a shot like this:

```
  "bbva-components-catalog": {
    "key": "bbva-web-components",
    "listedIn": "bower",
    "uri": "https://descinet.bbva.es/stash/scm/cat/bbva-components-catalog.git",
    "regexp": "=(.*?)"
  },
```
inside the .piscosour/dockerfiles directory we have a directory named **bbva-components-catalog**

with this Dockerfile as template:

```
FROM {{ fromImage }}
ADD {{ workingDir }}/.netrc /home/pisco/recipe
WORKDIR /home/pisco/recipe
USER root
RUN chown pisco:pisco .netrc
USER pisco
RUN mv .netrc $HOME
RUN bower install {{ uri }} -f
RUN rm -f $HOME/.netrc
WORKDIR /home/pisco/workspace
```

This scaffolding use plugin docker-chain dockerScaffold method. Data will be:

```
  {
    "key": "bbva-web-components",
    "listedIn": "bower",
    "uri": "https://descinet.bbva.es/stash/scm/cat/bbva-components-catalog.git",
    "regexp": "=(.*?)",
    "fromImage": ""
    "cmd": "bbva-components-catalog"
  }
```

#### Parameters needed:

- username: Username used to generate .netrc.
- password: Password used to generate .netrc.
- fromImage: Image used in FROM inside Dockerfile.

#### emit: 

- image: Name of the docker image generated.
- version: Used to tag docker image. 
- generated: push image to this.params.generated array (if exists) with all the images generated.

#### 4. recipe:docker-publish 'Publishing all generated docker images'
General info:

```
Contexts:  recipe
From: pisco-docker (0.3.1)
```
### Publish all the docker images generated to a registry

**Context:** Has to be executed inside a **recipe**.

Recive this.params.generated: if is empty nothing is done, if not:
 
- all the images are re-tagged with the registry ip:port 
- docker push to the registry. 

#### Parameters needed:

- generated: Array with all the docker images generated. if empty nothing is done.
- registry: (optional, default: docker hub is used) ip:port of the local registry to push the generated images.

#### Note for mac docker.

If you'd simply like to pass arguments to docker, add them to EXTRA_ARGS in /var/lib/boot2docker/profile. For example:

EXTRA_ARGS='
--label provider=virtualbox
--insecure-registry=10.0.0.1:5000
'
The docker process is started via /etc/init.d/docker which sources /var/lib/boot2docker/profile. $EXTRA_ARGS is passed transparently to the docker process towards the end of start().



### recipe::docker-base 'Generate docker matrioska for recipe'
[Go Index](#main-index):

How to execute this command:

    pisco recipe::docker-base

General info:

```
Contexts:  recipe
From: pisco-docker (0.3.1)
```
### Generate base docker image of one recipe.

**Context:** Has to be executed inside a **recipe**.

Read package.json and piscosour.json of the recipe and generate a docker image.

- The name of the docker image is: **piscosour/recipe.cmd** (param cmd inside piscosour.json)
- Write temporary files Dockerfile, .dockerignore, .netrc, entrypoint.sh files from template inside template directory. 
- At the and of the execution temporary files are deleted!.

#### Parameters needed:

- username: Username used to generate .netrc.
- password: Password used to generate .netrc.
- fromImage: Image used in FROM inside Dockerfile.

#### emit: 

- image: Name and tag of the generated image.
- username: Username used to generate .netrc.
- password: Password used to generate .netrc.
- generated: push image to this.params.generated array (if exists) with all the images generated. 

### recipe::docker-command 'Generate docker matrioska for command'
[Go Index](#main-index):

How to execute this command:

    pisco recipe::docker-command

General info:

```
Contexts:  recipe
From: pisco-docker (0.3.1)
```
### Generate command docker image from a command of a recipe.

**Context:** Has to be executed inside a **recipe**.

Read package.json and piscosour.json of the recipe ask for the command to be generated and execute this commands:

- Execute {recipe.cmd} --pstage core-check --b-neverStop inside the docker image. This autoinstall all npm dependencies inside the docker image.
- Write a entrypoint.sh script inside the docker image to be used as entrypoint of image: --b-disableSystemCheck --uuid {{ uuid }} this params are added to all commands command execute by this docker image.
- Checks if the version of the command 'docker run...' is the same of the introduced verson (using docker-chain plugin).
- Write temporary files Dockerfile, .dockerignore, .netrc, entrypoint.sh files from template inside template directory. 
- At the and of the execution temporary files are deleted!.

#### Parameters needed:

- username: Username used to generate .netrc.
- password: Password used to generate .netrc.
- fromImage: Image used in FROM inside Dockerfile.
- command: Command to be dockerize.
- uuid: used in google analytics. 

#### emit: 

- image: Name of the docker image generated.
- version: Used to tag docker image. 
- generated: push image to this.params.generated array (if exists) with all the images generated.

### recipe::docker-compose 'Generate docker-compose file for system dependencies'
[Go Index](#main-index):

How to execute this command:

    pisco recipe::docker-compose

General info:

```
Contexts:  recipe
From: pisco-docker (0.3.1)
```
### Documentation of shot here!

### recipe::docker-installations 'Append all installations to Docker matrioska'
[Go Index](#main-index):

How to execute this command:

    pisco recipe::docker-installations

General info:

```
Contexts:  recipe
From: pisco-docker (0.3.1)
```
### Improve the docker image of a command with all the requirements inside its shots 

**Context:** Has to be executed inside a **recipe**.

- Execute 'docker run -v `${process.cwd()}:/home/pisco/workspace` {fromImage} --pstage core-check --b-saveRequirements --b-disableSystemCheck' to get the **'requirements.json'** file.
- Install all system dependencies written inside requirements.json from Dockerfiles (*)  
- Write temporary files Dockerfile, .dockerignore, .netrc, entrypoint.sh files from template inside template directory. 
- At the and of the execution temporary files are deleted!.

#### Dockerfiles repository

System dependencies are resolved using:
 
 1. 'dockerfile' folder inside any recipe of the dependencies inside package.json of dockersour recipe.
 2. NOTE that .piscosour/dockerfiles directory can be use as Dockerfiles repository. So is posible to use this to write addhoc Dockerfiles.
 3. NOTE: We recomend to write general Dockerfile in order to be reused in other recipes.
  
For example: if we have a requirement written in a params.json of a shot like this:

```
  "bbva-components-catalog": {
    "key": "bbva-web-components",
    "listedIn": "bower",
    "uri": "https://descinet.bbva.es/stash/scm/cat/bbva-components-catalog.git",
    "regexp": "=(.*?)"
  },
```
inside the .piscosour/dockerfiles directory we have a directory named **bbva-components-catalog**

with this Dockerfile as template:

```
FROM {{ fromImage }}
ADD {{ workingDir }}/.netrc /home/pisco/recipe
WORKDIR /home/pisco/recipe
USER root
RUN chown pisco:pisco .netrc
USER pisco
RUN mv .netrc $HOME
RUN bower install {{ uri }} -f
RUN rm -f $HOME/.netrc
WORKDIR /home/pisco/workspace
```

This scaffolding use plugin docker-chain dockerScaffold method. Data will be:

```
  {
    "key": "bbva-web-components",
    "listedIn": "bower",
    "uri": "https://descinet.bbva.es/stash/scm/cat/bbva-components-catalog.git",
    "regexp": "=(.*?)",
    "fromImage": ""
    "cmd": "bbva-components-catalog"
  }
```

#### Parameters needed:

- username: Username used to generate .netrc.
- password: Password used to generate .netrc.
- fromImage: Image used in FROM inside Dockerfile.

#### emit: 

- image: Name of the docker image generated.
- version: Used to tag docker image. 
- generated: push image to this.params.generated array (if exists) with all the images generated.

### recipe::docker-publish 'Publishing all generated docker images'
[Go Index](#main-index):

How to execute this command:

    pisco recipe::docker-publish

General info:

```
Contexts:  recipe
From: pisco-docker (0.3.1)
```
### Publish all the docker images generated to a registry

**Context:** Has to be executed inside a **recipe**.

Recive this.params.generated: if is empty nothing is done, if not:
 
- all the images are re-tagged with the registry ip:port 
- docker push to the registry. 

#### Parameters needed:

- generated: Array with all the docker images generated. if empty nothing is done.
- registry: (optional, default: docker hub is used) ip:port of the local registry to push the generated images.

#### Note for mac docker.

If you'd simply like to pass arguments to docker, add them to EXTRA_ARGS in /var/lib/boot2docker/profile. For example:

EXTRA_ARGS='
--label provider=virtualbox
--insecure-registry=10.0.0.1:5000
'
The docker process is started via /etc/init.d/docker which sources /var/lib/boot2docker/profile. $EXTRA_ARGS is passed transparently to the docker process towards the end of start().



### all::install 'Install repository'
[Go Index](#main-index):

How to execute this command:

    pisco all::install

General info:

```
Contexts:  all
From: pisco-installer (0.1.5)
```
install the repository


# Plugins


## context
from: **piscosour (1.0.0-alpha.7)**  [Go Index](#main-index)

### Context for the pisco execution

With this plugin you can automatically check where recipe was executed. This plugin take configuration from params and expose two method and make one pre-hook check.
 
#### How two configure repoType definitions

You can configure the repoTypes definition in all the configurations files where pisco recipes are configured [see information for pisco configuration](doc/Load_Parameters.md). 

**Is recommend to use the piscosour.json file of your recipe**

The param is called contexts, and must be a Hash with the name of the repoType as key and Array with all the rules the repo must to match.

example of piscosour.json:
```
    "params": {
        "contexts": {
            "node-module": [
                {
                    "file": "package.json",
                    "conditions": [
                        "that.version"
                    ]
                },
                {
                    "file": "piscosour.json",
                    "noexists": "true"
                }
            ],
            "recipe": [
                {
                    "sufficient": true,
                    "file": ".piscosour/piscosour.json",
                    "conditions": [
                        "that.repoType==='recipe'"
                    ]
                },
                {
                    "file": "package.json",
                    "conditions": [
                        "that.keywords.indexOf('piscosour-recipe')>=0"
                    ]
                },
                {
                    "file": "piscosour.json"
                }
            ]
        }
    },
```

**Rules:**

Define all rules that a repoType must match. All rules not sufficient must to be satisfied.

- **file:** The path of the file relative to the root of the repoType. (for exemple: package.json for a node-module)
- **sufficient:** If this rule is matched the rest of the rules are ignored. If is not matched, the rule is ignored and the rest of rules are evaluated (default: false)
- **noexist:** Check if the file is **not** present. (default: false)
- **conditions:** Is an array with all the conditions that the file must to match. 
  1. The file must to be a correct json file.
  2. **that** is the instance of the json object.
  3. write one condition per element in your array. 
  4. The conditions were evaluated using javascript.

#### Pre-hook: Check one shot is executed in the root of any repository type.

By default, the shot behaviour is assume that repoType is mandatory, if you need to execute one shot without this check of context, use **contextFree** parameter. **contextFree** usually is used for shotd like "create" or something like that.  

only parametrized in params.json:

```
{
 [...]
  "contextFree" : true
}
```

A user command (straw) only could be contextFree if all of its shots are contextFree. If only one shot of a straw is not contextFree then the context will be checked.

**Disable this check using options in the command line**: Is possible to disable this check using this option in the command line: **--b-disableContextCheck**. Usefull for system requirements checks.

#### addon: this.ctxIs

| Param | Description |
| --- | --- |
| name | name of the repoType to test|


Use this.ctxIs to ask pisco where was executed.

```
let isComponent = this.ctxIs("component");
```

isComponent must to be true if your recipe was executed in the root of a component.

#### addon: this.ctxWhoami

Ask pisco the repoTypes of the directory where you executed your recipe.

```
let repos = this.ctxWhoami();
```

repos is an Array of types that match the place where your recipe was executed.
## fsutils
from: **piscosour (1.0.0-alpha.7)**  [Go Index](#main-index)

### fs plugin (fs addons for piscosour)

#### this.fsCreateDir

| Param | Description |
| --- | --- |
| | |

#### this.fsExists

| Param | Description |
| --- | --- |
| | |

#### this.fsReadConfig

| Param | Description |
| --- | --- |
| | |

#### this.fsReadFile

| Param | Description |
| --- | --- |
| | |

#### this.fsCopyDirFiltered

| Param | Description |
| --- | --- |
| | |

#### this.fsCopyFileFiltered

| Param | Description |
| --- | --- |
| | |

#### this.fsAppendBundle

| Param | Description |
| --- | --- |
| | |

## inquirer
from: **piscosour (1.0.0-alpha.7)**  [Go Index](#main-index)

### Inquirer plugin

This plugin use inquirer library [Inquirer documentation](https://www.npmjs.com/package/inquirer)

set type 

params.json
```
  "prompts": [
    {
      "type": "#setType()",
      "name": "doDefault",
      "required": true,
      "message": "Do you want to set default repository type?"
    }
  ],
```

- '#' indicate that is necesary to use a function in the shot in order to resolve the type value.
- '()' set that pisco needs to execute this function on order to get the value. 

shot.js
```
  setType: function() {
    return 'confirm';
  },
```

#### this.inquire

| Param | Description |
| --- | --- |
| | |
## installer
from: **piscosour (1.0.0-alpha.7)**  [Go Index](#main-index)

### Install recipes needed

This plugins install all recipes needed for the execution. 

#### Hooks:

- **'core-install'**: Perform npm installation of the compatible version of the recipe
- **config**: Execute 'pisco -w' in order to write the scullion configuration.
- **run**: Execute the installed step. 
## launcher
from: **piscosour (1.0.0-alpha.7)**  [Go Index](#main-index)

### Execute any command with pisco.

Core plugin used to execute any command inside pisco.

#### this.sh

| Param | Description |
| --- | --- |
| command | command that you want to execute|
| reject | reject function, called if command fails (stop overall execcution)|
| loud | Boolean if true echo of command is done|

Syncronous method use to execute any command in your environment.

#### this.sudo

| Param | Description |
| --- | --- |
| | |

#### this.executeSync

| Param | Description |
| --- | --- |
| | |

#### this.executeStreamed

| Param | Description |
| --- | --- |
| | |

#### this.execute

| Param | Description |
| --- | --- |
| | |

#### this.executeParallel

| Param | Description |
| --- | --- |
| | |
## os
from: **piscosour (1.0.0-alpha.7)**  [Go Index](#main-index)


Plugins used to check Operating System where pisco is running

###Addons:

#### this.isWin();

return true if the Operation System where pisco is executed is Windows.

#### this.isMac();

return true if the Operation System where pisco is executed is MacOS.
## piscosour
from: **piscosour (1.0.0-alpha.7)**  [Go Index](#main-index)

### Expose piscosour config

Expose core configuration to shots.

#### this.piscoConfig

Expose the piscosour config object [Trabajar con shots](doc/api.md#Config)
  
#### this.piscoFile

return the literal: 'piscosour.json'

#### this.pkgFile

return the literal: 'package.json'


## skipper
from: **piscosour (1.0.0-alpha.7)**  [Go Index](#main-index)

### Skipper plugin

Skips the shot execution when receiving the param "\_skip": true

## stream-write-hook
from: **piscosour (1.0.0-alpha.7)**  [Go Index](#main-index)

### Intercepts any stream flow in order to be able to manage the information inside.

This way you can capture all the output of any stream and do whatever you want with it. The way to do this has two stages:

#### 1. Start intercepting the stream

At any place in yor code is posible to intercept any stream the only thing you have to do is use streamWriteHook method:

```
   let capture = '';
   this.streamWriteHook(process.stdout, function(chunk, encoding, cb) {
     capture += stripcolorcodes(chunk.toString(encoding));
   });
```

(*) stripcolorcodes() is used to deleting all coloured characters from stream. 
  
Capture will contain all from content of process.stdout

#### 2. Stop intercepting the stream.

Is necesary to do release all system resources, so do this:

```
   this.streamWriteUnhook(process.stdout);
```

### Addons:

#### this.streamWriteHook

starts the hook

| Param | Description |
| --- | --- |
|stream |Stream to be hooked |
|cb |Function to call each time chunk is append to stream |

#### this.streamWriteUnhook

stops the hook

| Param | Description |
| --- | --- |
|stream |Stream to be Unhooked |



## system-checker
from: **piscosour (1.0.0-alpha.7)**  [Go Index](#main-index)

### How to check system requirements of a piscosour command.

The system requirements are other commands that pisco needs for a pipeline execution. This plugin checks if everything is installed and ready to use by piscosour.

#### 1. Define version match (Only in the cases where could be diferent)

By default version is taken asking the command with -v and assume that command return version plain without test.

    bower -v 
    > 1.7.9

But in some cases this is not true, in this cases you can define matches inside **piscosour.json**:  

Example of piscosour.json
```
{
  [...]  
  "params": {
    [...]
    "versions": {
      "java": {
        "option" : "-version",
        "regexp" : "\"(.*?)_"
      },
      [...]
    },
  [...]
}
```

By default this is the versions defined inside core:

```
    "versions": {
      "bower" : {
        "npm": true,
        "list": "bower cache list",
        "cmdInstaller": "bower install"        
      },
      "npm" : {
        "list": "npm list -g --depth 0",
        "regexp": "\\@(.*?)\\s"
        "cmdInstaller": "npm install -g"
      },    
      "java": {
        "option" : "-version",
        "regexp" : "\"(.*?)_"
      },
      "sass" : {
        "regexp" : "s (.*?) "
      },
      "git": {
        "option" : "--version",
        "regexp" : "n (.*?)\\n"
      }
    }
```

- **key** (for example 'java'): is the command that you need inside your shot.
- **option**: (optional, default is '-v') if version is set the way to check this version.
- **regexp**: (optional) if version is on a string the way to extract only the version. Overwrite version defined on piscosour.json
- **list:** (optional) command used to get a stdout to use the regexp function in orther to get the version of the item you want to check.
- **cmdInstaller:** (optional) command used to install packages using this key (for example 'npm install -g' or 'bower install')

##### List tip

Useful when you want to check if some dependency is listed by any command. 
 
 1. Set list in version (f.i. in npm)
 2. In any other requirement set listedIn: (f.i. module: set listedIn: npm)

this pugling is going to check the version returned when the match with regexp is done.

#### 2. Define system requirements in all your shots.

The system requirements are defined in **params.json** file inside every shot.

-**requirements** All dependencies are defined inside requirements

Example of params.json:
```
{
  "requirements": {
    "polymer" : {
      "installer": "bower",
      "listedIn": "bower",
      "uri": "https://github.com/Polymer/polymer.git#v1.6.1",
      "regexp": "=(.*?)"
    },
    "generator-pisco-recipe" : {
      "installer": "npm",
      "listedIn": "npm",
      "version" : "0.0.2"
    },
    "pisco" : {
      "installer": "npm",
      "pkg" : "piscosour",
      "version" : "0.5.0"
    },
    "cordova" : {
      "installer": "npm",
      "version" : "5.4.1"
    },
    "yo" : {"npm": true},
    "bower" : {
      "installer": "npm",
      "version" : "1.7.9"
    },
    "java": {
      "version": "1.7.0"
    },
    "sass" : {
      "version": "3.1.0"
    }
  },
  [...]
}
```

This is the possible parameters that you need in order to define a system requirement.

- **key** (for example 'java'): is the command that you need inside your shot.
- **installer** (optional): package command, search inside requirements to check the cmdInstaller.
- **version**: (optional) is the minimum version that you need for the command. Overwrite version defined on piscosour.json
- **option**: (optional, default is '-v') if version is set the way to check this version.
- **regexp**: (optional) if version is on a string the way to extract only the version. Overwrite version defined on piscosour.json
- **listedIn**: (optional) use the 'list' value of this parameter in order to check if this dependency is available.
- **uri**: (optional) only apply in npm commands. Uri of the git repo.
- **pkg**: (optional) only apply in npm commands. Used when executable and pkg are different.
 
#### 3. Check if a pisco command has all system requirements satisfied

    cells component:validate --pstage core-check --b-disablePrompts --b-disableContextCheck
    
Command explanation:

- **cells component:validate**: is the pisco command that you want to check.
- **--pstage core-check**: this means that only the core-check stage is executed for all the pipeline. System requirements check is a **pre-hook** of the stage **core-check** so you have to execute only this stage.
- **--b-disablePrompts**: disable all prompts for the command.
- **--b-disableContextCheck**: disable context checks for commands that need one.

this is the result of the execution for every shot that would have system requirements defined:

```
[12:14:32] java ( 1.7.0 ) is required ->  java ( 1.8.0_65 ) impossible to parse ... WARNING!
[12:14:33] cordova ( 5.4.1 ) is required ->  cordova ( 5.4.1 ) is installed ... OK
[12:14:34] yo ( any version ) is required ->  yo is installed ... OK
[12:14:35] bower ( 1.0.0 ) is required ->  bower ( 1.7.7 ) is installed ... OK
[12:14:35] sass ( 3.1.0 ) is required ->  sass ( 3.4.19 ) is installed ... OK
```

If any system requirement is not satisfied the command will throw an error and stops...
## system-saver
from: **piscosour (1.0.0-alpha.7)**  [Go Index](#main-index)

### Write the requirements into a global file 'requirements.json'

    cells component:validate --pstage check --b-saveRequirements --b-disablePrompts --b-disableContextCheck --b-disableSystemCheck
    
Command explanation:

- **cells component:validate**: is the pisco command that you want to check.
- **--pstage check**: this means that only the check stage is executed for all the pipeline. System requirements check is a **pre-hook** of the stage **check** so you have to execute only this stage.
- **--b-saveRequirements**: tells pisco to save all system requirements in one file.
- **--b-disablePrompts**: disable all prompts for the command. 
- **--b-disableContextCheck**: disable context checks for commands that need one.
- **--b-disableSystemCheck**: disable system checks in order to avoid vicious cycle.

this is the file resulting of the execution: the mix of all system requirements for all shots.

```
{
  "npm": {
    "module": "generator-pisco-recipe",
    "version": "0.0.2"
  },
  "java": {
    "version": "1.7.0",
    "option": "-version",
    "regexp": "\"(.*?)_"
  },
  "cordova": {
    "version": "5.4.1"
  },
  "yo": {},
  "bower": {
    "version": "1.0.0"
  },
  "sass": {
    "version": "3.1.0",
    "regexp": "s (.*?) "
  }
}
```
## test
from: **piscosour (1.0.0-alpha.7)**  [Go Index](#main-index)

Testing plugin. NO FUNCTIONALITY.
## polyserve
from: **pisco-polyserve (0.1.1)**  [Go Index](#main-index)


## selenium
from: **pisco-selenium (0.1.0)**  [Go Index](#main-index)


## eslint
from: **pisco-eslint (0.1.0)**  [Go Index](#main-index)


## docker-chain
from: **pisco-docker (0.3.1)**  [Go Index](#main-index)

### Share docker functionality between docker shots.

This plugin has no hooks.

#### this.dockerAuthor: Obtain author from package.json/author of a recipe.

| Param | Description |
| --- | --- |
| author| author from a package.json|

Output Dockerfile MAINTAINER tag from author value inside package.json

#### this.dockerBuild: Generate a docker image from a given Dockerfile.

| Param | Description |
| --- | --- |
| dockerImage| Name of the image to be generated|
| version| Version to use to tag the image|
| dockerPath| (Optional, default: '.') path to the Dockerfile|
| force| (Optional, defaul: false) force the generation of the image without any check|

**Needs docker to be installed on the machine**

Generate a Dockerimage reading the dockerfile inside the dockerfile. If force is false first check if the image is allready created.

#### this.dockerCheck: Check docker image version of a piscosour command is right.

| Param | Description |
| --- | --- |
|dockerImage| Name of the image to be checked|
|version| Version to be checked|
|ko| Function to call if fails|

Check if the version that one docker image with a pisco recipe returns when is executed with '-v' paramter is the same of the version passed in function. So, in other words this function execute 'docker run {dockerImage} -v' and checks if is the same of the version passed. If fails call ko function.

#### this.dockerClean: Delete temporal files generated in the process.

| Param | Description |
| --- | --- |
| files| Array of files to be deleted |
| dirs| Array of dirs to be recursively deleted |

Deleted all listed files or directories, **never fails** even if the file/directory do not exits.

#### this.dockerOutdir: Obtain the tmpDockerDir where scaffold are created.

| Param | Description |
| --- | --- |
| key| key of the requirement inside params.json of the shot. |

Return the tmp docker directory where the scaffol is output.

#### this.dockerScaffold: Generate final Dockerfiles from templates.

| Param | Description |
| --- | --- |
| key| key of the requirement inside params.json of the shot. |
| options| value of the requirement inside params.json of the shot. |

Generate the final scaffolded Dockerfile (or all the files inside the template directory) using options as data to be process by template engine (nunjucks). **NOTE: dockerImage -as-> 'fromImage' and key -as-> 'cmd' are included in data**. 


## nunjucks
from: **pisco-plugin-nunjucks (0.1.0)**  [Go Index](#main-index)

This plugin renders a scaffold folder with [nunjucks](https://mozilla.github.io/nunjucks/api.html) and [metalsmith](https://www.metalsmith.io)

### pisco-plugin-nunjucks - njkRender

```
let p = this.njkRender(root, from, to, vars);
```

Where

- *root* is the root directory where origin and destination folder are placed,
- *from* is the origin folder with the scaffold and nunjucks templates,
- *to* is the destination folder,
- *vars* is an object with the vars to be replaced and used in the nunjucks templates.

and returns a Promise.

*Example*:

When the plugin is called like:

```
  this.njkRender(
	  path.resolve('./'),
		'fromPath',
		'toPath',
		{ foo: 'meow' })
	.then(
		something();
	)
	.catch( (reason) => {
		console.error(reason);
	});
```

And exists a file `./fromPath/example.html` with the content:

```
<div>
This is a {{ foo }} cat 
</div>
```

Then a new file `./toPath/example.html` is created:

```
<div>
This is a meow cat 
</div>
```


# Contexts


[Go Index](#main-index):

|Name|Description|
|---|---|
|node-module|node-module context|
|recipe|Piscosour recipe context|
|app|Cells app context|
|component|Cells component context|
|cordova-app|Cells cordova app context|
|environment|Cells environment context|



# Recipes


[Go Index](#main-index):

|Name|Version|Description|
|---|---|---|
|piscosour|1.0.0-alpha.7|Get all your devops tools wrapped-up!|
|cells-component-ci|0.2.7|cli tools for your cells components - for bamboo|
|pisco-cells-contexts|1.0.1|Pisco context definitions for Cells project|
|pisco-cells-component-demo-tests|0.2.4|Cells components demo validation|
|pisco-polyserve|0.1.1|polyserve plugin for pisco|
|pisco-selenium|0.1.0|selenium plugin for pisco recipes|
|pisco-cells-component-lint|0.3.6|lint validation for cells components|
|pisco-eslint|0.1.0|ESLint plugin for piscosour|
|pisco-cells-component-unit-tests|0.2.2|cells components unit tests execution and coverage analysis|
|pisco-docker|0.3.1|Docker generator for pisco|
|pisco-plugin-nunjucks|0.1.0|Pisco plugin for templating with metalsmith and nunjucks|
|pisco-installer|0.1.5|Create a piscosour recipe from a scaffold template|


