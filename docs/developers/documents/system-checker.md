---
title: system-checker
name: system-checker
type: plugins
layout: api_doc.html
---
# Plugins: system-checker


### How to check system requirements of a piscosour command.

The system requirements are other commands that pisco needs for a pipeline execution. This plugin checks if everything is installed and ready to use by piscosour.

#### 1. Define version match (Only in the cases where could be diferent)

By default version is taken asking the command with -v and assume that command return version plain without test.

    bower -v 
    &gt; 1.7.9

But in some cases this is not true, in this cases you can define matches inside **piscosour.json**:  

Example of piscosour.json
```
{
  [...]  
  &quot;params&quot;: {
    [...]
    &quot;versions&quot;: {
      &quot;java&quot;: {
        &quot;option&quot; : &quot;-version&quot;,
        &quot;regexp&quot; : &quot;\&quot;(.*?)_&quot;
      },
      [...]
    },
  [...]
}
```

By default this is the versions defined inside core:

```
    &quot;versions&quot;: {
      &quot;bower&quot; : {
        &quot;npm&quot;: true,
        &quot;list&quot;: &quot;bower cache list&quot;,
        &quot;cmdInstaller&quot;: &quot;bower install&quot;        
      },
      &quot;npm&quot; : {
        &quot;list&quot;: &quot;npm list -g --depth 0&quot;,
        &quot;regexp&quot;: &quot;\\@(.*?)\\s&quot;
        &quot;cmdInstaller&quot;: &quot;npm install -g&quot;
      },    
      &quot;java&quot;: {
        &quot;option&quot; : &quot;-version&quot;,
        &quot;regexp&quot; : &quot;\&quot;(.*?)_&quot;
      },
      &quot;sass&quot; : {
        &quot;regexp&quot; : &quot;s (.*?) &quot;
      },
      &quot;git&quot;: {
        &quot;option&quot; : &quot;--version&quot;,
        &quot;regexp&quot; : &quot;n (.*?)\\n&quot;
      }
    }
```

- **key** (for example &#39;java&#39;): is the command that you need inside your shot.
- **option**: (optional, default is &#39;-v&#39;) if version is set the way to check this version.
- **regexp**: (optional) if version is on a string the way to extract only the version. Overwrite version defined on piscosour.json
- **list:** (optional) command used to get a stdout to use the regexp function in orther to get the version of the item you want to check.
- **cmdInstaller:** (optional) command used to install packages using this key (for example &#39;npm install -g&#39; or &#39;bower install&#39;)

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
  &quot;requirements&quot;: {
    &quot;polymer&quot; : {
      &quot;installer&quot;: &quot;bower&quot;,
      &quot;listedIn&quot;: &quot;bower&quot;,
      &quot;uri&quot;: &quot;https://github.com/Polymer/polymer.git#v1.6.1&quot;,
      &quot;regexp&quot;: &quot;=(.*?)&quot;
    },
    &quot;generator-pisco-recipe&quot; : {
      &quot;installer&quot;: &quot;npm&quot;,
      &quot;listedIn&quot;: &quot;npm&quot;,
      &quot;version&quot; : &quot;0.0.2&quot;
    },
    &quot;pisco&quot; : {
      &quot;installer&quot;: &quot;npm&quot;,
      &quot;pkg&quot; : &quot;piscosour&quot;,
      &quot;version&quot; : &quot;0.5.0&quot;
    },
    &quot;cordova&quot; : {
      &quot;installer&quot;: &quot;npm&quot;,
      &quot;version&quot; : &quot;5.4.1&quot;
    },
    &quot;yo&quot; : {&quot;npm&quot;: true},
    &quot;bower&quot; : {
      &quot;installer&quot;: &quot;npm&quot;,
      &quot;version&quot; : &quot;1.7.9&quot;
    },
    &quot;java&quot;: {
      &quot;version&quot;: &quot;1.7.0&quot;
    },
    &quot;sass&quot; : {
      &quot;version&quot;: &quot;3.1.0&quot;
    }
  },
  [...]
}
```

This is the possible parameters that you need in order to define a system requirement.

- **key** (for example &#39;java&#39;): is the command that you need inside your shot.
- **installer** (optional): package command, search inside requirements to check the cmdInstaller.
- **version**: (optional) is the minimum version that you need for the command. Overwrite version defined on piscosour.json
- **option**: (optional, default is &#39;-v&#39;) if version is set the way to check this version.
- **regexp**: (optional) if version is on a string the way to extract only the version. Overwrite version defined on piscosour.json
- **listedIn**: (optional) use the &#39;list&#39; value of this parameter in order to check if this dependency is available.
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
[12:14:32] java ( 1.7.0 ) is required -&gt;  java ( 1.8.0_65 ) impossible to parse ... WARNING!
[12:14:33] cordova ( 5.4.1 ) is required -&gt;  cordova ( 5.4.1 ) is installed ... OK
[12:14:34] yo ( any version ) is required -&gt;  yo is installed ... OK
[12:14:35] bower ( 1.0.0 ) is required -&gt;  bower ( 1.7.7 ) is installed ... OK
[12:14:35] sass ( 3.1.0 ) is required -&gt;  sass ( 3.4.19 ) is installed ... OK
```

If any system requirement is not satisfied the command will throw an error and stops...

