---
title: Requirements
layout: doc_page.html
order: 10
---

# How to check system requirements of a piscosour command.

The system requirements are other commands that pisco needs for a [flow](./03-flows,md) execution. This checks if everything is installed and ready to use by piscosour.

## 1. Define version match (Only in the cases where could be different)

By default, version is taken asking the command with -v and assume that command return version plain without test.

Example with bower:

```sh
$ bower -v 
1.7.9
```

But in some cases this is not true, in this cases you can define matches inside **piscosour.json**:  

Example of piscosour.json

```json
{
  "params": {
    "versions": {
      "java": {
        "option" : "-version",
        "regexp" : "\"(.*?)_"
      }
    }
  }
}
```

By default these are the versions defined inside core:

```json
{
  "params": {
    "versions": {
      "bower" : {
        "npm": true,
        "list": "bower cache list",
        "cmdInstaller": "bower install"        
      },
      "npm" : {
        "list": "npm list -g --depth 0",
        "regexp": "\\@(.*?)\\s",
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
  }
}
```

- **key** (for example 'java'): is the command that you need inside your step.
- **option**: (optional, default is '-v') if version is set the way to check this version.
- **regexp**: (optional) if version is on a string the way to extract only the version. Overwrite version defined on piscosour.json
- **list:** (optional) command used to get a stdout to use the regexp function in orther to get the version of the item you want to check.
- **cmdInstaller:** (optional) command used to install packages using this key (for example 'npm install -g' or 'bower install')

### List tip

Useful when you want to check if some dependency is listed by any command. 
 
 1. Set list in version (f.i. in npm)
 2. In any other requirement set listedIn: (f.i. module: set listedIn: npm)

## 2. Define system requirements in all your steps.

The system requirements are defined in `config.json` file inside every steps.

-**requirements** All dependencies are defined inside requirements

Example of config.json:

```json
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
  }
}
```

This is the possible parameters that you need in order to define a system requirement.

- **key** (for example 'java'): is the command that you need inside your step.
- **installer** (optional): package command, search inside requirements to check the cmdInstaller.
- **version**: (optional) is the minimum version that you need for the command. Overwrite version defined on piscosour.json
- **option**: (optional, default is '-v') if version is set the way to check this version.
- **regexp**: (optional) if version is on a string the way to extract only the version. Overwrite version defined on piscosour.json
- **listedIn**: (optional) use the 'list' value of this parameter in order to check if this dependency is available.
- **uri**: (optional) only apply in npm commands. Uri of the git repo.
- **pkg**: (optional) only apply in npm commands. Used when executable and pkg are different.
 
## 3. Check if a pisco command has all system requirements satisfied

```sh
pisco context-sample:step-name --pstage core-check --b-disablePrompts --b-disableContextCheck
```
    
Where:

- **pisco context-sample:step-name**: is the pisco command that you want to check.
- **--pstage core-check**: this means that only the core-check stage is executed for all the pipeline. System requirements check is a **pre-hook** of the stage **core-check** so you have to execute only this stage.
- **--b-disablePrompts**: disable all prompts for the command.
- **--b-disableContextCheck**: disable context checks for commands that need one.

this is the result of the execution for every step that would have system requirements defined:

```sh
[12:14:32] java ( 1.7.0 ) is required ->  java ( 1.8.0_65 ) impossible to parse ... WARNING!
[12:14:33] cordova ( 5.4.1 ) is required ->  cordova ( 5.4.1 ) is installed ... OK
[12:14:34] yo ( any version ) is required ->  yo is installed ... OK
[12:14:35] bower ( 1.0.0 ) is required ->  bower ( 1.7.7 ) is installed ... OK
[12:14:35] sass ( 3.1.0 ) is required ->  sass ( 3.4.19 ) is installed ... OK
```

If any system requirement is not satisfied the command will throw an error and stops...

# Write the requirements into a global file 'requirements.json'

```sh
cells component:validate --pstage check --b-saveRequirements --b-disablePrompts --b-disableContextCheck --b-disableSystemCheck
```

Command explanation:

- **cells component:validate**: is the pisco command that you want to check.
- **--pstage check**: this means that only the check stage is executed for all the pipeline. System requirements check is a **pre-hook** of the stage **check** so you have to execute only this stage.
- **--b-saveRequirements**: tells pisco to save all system requirements in one file.
- **--b-disablePrompts**: disable all prompts for the command. 
- **--b-disableContextCheck**: disable context checks for commands that need one.
- **--b-disableSystemCheck**: disable system checks in order to avoid vicious cycle.

this is the file resulting of the execution: the mix of all system requirements for all steps.

```json
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