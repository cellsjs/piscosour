---
title: system-saver
name: system-saver
type: plugins
layout: api_doc.html
---
# Plugins: system-saver


### Write the requirements into a global file &#39;requirements.json&#39;

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
  &quot;npm&quot;: {
    &quot;module&quot;: &quot;generator-pisco-recipe&quot;,
    &quot;version&quot;: &quot;0.0.2&quot;
  },
  &quot;java&quot;: {
    &quot;version&quot;: &quot;1.7.0&quot;,
    &quot;option&quot;: &quot;-version&quot;,
    &quot;regexp&quot;: &quot;\&quot;(.*?)_&quot;
  },
  &quot;cordova&quot;: {
    &quot;version&quot;: &quot;5.4.1&quot;
  },
  &quot;yo&quot;: {},
  &quot;bower&quot;: {
    &quot;version&quot;: &quot;1.0.0&quot;
  },
  &quot;sass&quot;: {
    &quot;version&quot;: &quot;3.1.0&quot;,
    &quot;regexp&quot;: &quot;s (.*?) &quot;
  }
}
```

