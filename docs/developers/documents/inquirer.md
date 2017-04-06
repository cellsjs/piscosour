---
title: inquirer
name: inquirer
type: plugins
layout: api_doc.html
---
# Plugins: inquirer


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

