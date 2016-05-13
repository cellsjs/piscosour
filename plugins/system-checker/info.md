### How to check system requirements of a piscosour command.

The system requirements are other commands that pisco needs for a pipeline execution. This plugin checks if everything is installed and ready to use by piscosour.

#### 1. Define system requirements in all your shots.

The system requirements are defined in **params.json** file inside every shot.

Example of params.json:
```
{
  "requirements": {
    "java": {
      "version": "1.7.0",
      "option" : "-version",
      "regexp" : "\"(.*?)\""
    },
    "cordova" : {
      "version" : "5.4.1"
    },
    "yo" : {},
    "bower" : {
      "version" : "1.0.0"
    },
    "sass" : {
      "version": "3.1.0",
      "regexp" : "s (.*?) "
    }
  },
  [...]
}
```

This is the possible parameters that you need in order to define a system requirement.

- **key** (for example 'java'): is the command that you need inside your shot.
- **version**: (optional) is the minimum version that you need for the command.
- **option**: (optional, default is '-v') if version is set the way to check this version.
- **regexp**: (optional) if version is on a string the way to extract only the version.
 
#### 2. Check if a pisco command has all system requirements satisfied

    cells component:validate --pstage check --b-syscheck
    
Command explanation:

- **cells component:validate**: is the pisco command that you want to check.
- **--pstage check**: this means that only the check stage is executed for all the pipeline. System requirements check is a **pre-hook** of the stage **check** so you have to execute only this stage.
- **--b-syscheck**: tells pisco to check the system requirements. By default this check is not madden. (b- is the way to say pisco that this option is a Boolean, is the same of **--syscheck true**)

this is the result of the execution for every shot that would have system requirements defined:

```
[12:14:32] java ( 1.7.0 ) is required ->  java ( 1.8.0_65 ) impossible to parse ... WARNING!
[12:14:33] cordova ( 5.4.1 ) is required ->  cordova ( 5.4.1 ) is installed ... OK
[12:14:34] yo ( any version ) is required ->  yo is installed ... OK
[12:14:35] bower ( 1.0.0 ) is required ->  bower ( 1.7.7 ) is installed ... OK
[12:14:35] sass ( 3.1.0 ) is required ->  sass ( 3.4.19 ) is installed ... OK
```

If any system requirement is not satisfied the command will throw an error and stops...