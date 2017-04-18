---
title: system-saver
name: system-saver
type: plugins
layout: api_doc.html
---
# Plugins: system-saver


# system-saver plugin

Write the [requirements](../guides/10-requirements.md) into a global file 'requirements.json'.

## core-check hook

Implements a parameter `saveRequirements: true | false` to write all requirements in a file `requirements.json`

Example of usage `--b-saveRequirements` in the command line:

```sh
pisco flow-name:step-name --pstage check --b-saveRequirements --b-disablePrompts --b-disableContextCheck --b-disableSystemCheck
```
    
Command explanation:

- `pisco flow-name:step-name`: is the pisco command that you want to check.
- `--pstage check`: this means that only the check stage is executed for all the pipeline. System requirements check is a **pre-hook** of the stage **check** so you have to execute only this stage.
- `--b-saveRequirements`: tells pisco to save all system requirements in one file.
- `--b-disablePrompts`: disable all prompts for the command. 
- `--b-disableContextCheck`: disable context checks for commands that need one.
- `--b-disableSystemCheck`: disable system checks in order to avoid vicious cycle.

This is a example of the file `requirements.json` with the result of the execution, the mix of all system requirements for all steps:

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

