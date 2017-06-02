# system-checker plugin

The system [requirements](../guides/10-requirements.md) are other commands that pisco needs for a pipeline execution. This plugin checks if everything is installed and ready to use by piscosour.

**IMPORTANT:**

- `TIP 1:` This configuration is mandatory to be complete always when you use other command line tool inside a step. (for example java , git, cordova, bower...).
- `TIP 2:` This configuration is used by piscosour not only to check but even to provide all this externals tools for you. (for example with Dockerfile inside a docker or a playbook of ansible.)

## core-check hook

Realize how to check system requirements of a piscosour command.

### 1. Define version match (Only in the cases where could be diferent)

By default version is taken asking the command with -v and assume that command return version plain without test.

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

By default this is the versions defined inside core:

```json
{
  "params": {
    "versions": {
      "cordova" : {
        "installer": "npm"
      },
      "bower" : {
        "installer": "npm",
        "list": "bower cache list",
        "cmdInstaller": "bower install"
      },
      "npm" : {
        "list": "npm list -g --depth 0",
        "regexp": "\\@(.*?)\\s",
        "cmdInstaller": "npm install -g"
      },
      "yo": {
        "installer": "npm",
        "option": "--version"
      },
      "java": {
        "option": "-version",
        "regexp": "\"(.*?)_"
      },
      "sass": {
        "regexp": "s (.*?) "
      },
      "git": {
        "option": "--version",
        "regexp": "n (.*?)\\n"
      },
      "curl": {
        "option": "--version",
        "regexp": "curl (.*?) "
      },
      "docker": {
        "regexp": "n (.*?),"
      },
      "chrome": {
        "uncheckable" : true
      },
      "firefox": {
        "uncheckable" : true
      }
    }
  }
}
```

**`versions` could take same parameters as requirements [Possible parameters](#parameters)**

- `key` (for example 'java'): is the command that you need inside your step.
- `option`: (optional, default is '-v') if version is set the way to check this version.
- `regexp`: (optional) if version is on a string the way to extract only the version. Overwrite version defined on piscosour.json
- `list:` (optional) command used to get a stdout to use the regexp function in orther to get the version of the item you want to check.
- `cmdInstaller:` (optional) command used to install packages using this key (for example 'npm install -g' or 'bower install')
- `uncheckable` (default: false) tells pisco that this requirement is not possible to be checked.

#### List tip

Useful when you want to check if some dependency is listed by any command. 
 
 1. Set list in version (f.i. in npm)
 2. In any other requirement set listedIn: (f.i. module: set listedIn: npm)

this plugin is going to check the version returned when the match with regexp is done.

### 2. Define system requirements in all your steps.

The system requirements are defined in `config.json` file inside every step.

**requirements** All dependencies are defined inside requirements, 

**IMPORTANT: effective requirements are going to be the merge between `versions` and `requirements` with more precedence for `requirements` of each step.** 

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

<a name="parameters"></a>This is the possible parameters that you need in order to define a system requirement.

- `key` (for example 'java'): is the command that you need inside your step.
- `installer` (optional): package command, search inside requirements to check the cmdInstaller.
- `version`: (optional) is the minimum version that you need for the command. Overwrite version defined on piscosour.json
- `option`: (optional, default is '-v') if version is set the way to check this version.
- `regexp`: (optional) if version is on a string the way to extract only the version. Overwrite version defined on piscosour.json
- `listedIn`: (optional) use the 'list' value of this parameter in order to check if this dependency is available.
- `uncheckable` (default: false) tells pisco that this requirement is not possible to be checked.
- `uri`: (optional) only apply in npm commands. Uri of the git repo.
- `pkg`: (optional) only apply in npm commands. Used when executable and pkg are different.
 
### 3. Check if a pisco command has all system requirements satisfied

    pisco context-sample:step-name --pstage core-check --b-disablePrompts --b-disableContextCheck
    
Command explanation:

- `pisco context-sample:step-name`: is the pisco command that you want to check.
- `--pstage core-check`: this means that only the core-check stage is executed for all the pipeline. System requirements check is a **pre-hook** of the stage **core-check** so you have to execute only this stage.
- `--b-disablePrompts`: disable all prompts for the command.
- `--b-disableContextCheck`: disable context checks for commands that need one.

this is the result of the execution for every step that would have system requirements defined:

```
[12:14:32] java ( 1.7.0 ) is required ->  java ( 1.8.0_65 ) impossible to parse ... WARNING!
[12:14:33] cordova ( 5.4.1 ) is required ->  cordova ( 5.4.1 ) is installed ... OK
[12:14:34] yo ( any version ) is required ->  yo is installed ... OK
[12:14:35] bower ( 1.0.0 ) is required ->  bower ( 1.7.7 ) is installed ... OK
[12:14:35] sass ( 3.1.0 ) is required ->  sass ( 3.4.19 ) is installed ... OK
```

If any system requirement is not satisfied the command will throw an error and stops...