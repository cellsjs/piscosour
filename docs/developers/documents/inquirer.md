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
  &quot;prompts&quot;: [
    {
      &quot;type&quot;: &quot;#setType()&quot;,
      &quot;name&quot;: &quot;doDefault&quot;,
      &quot;required&quot;: true,
      &quot;message&quot;: &quot;Do you want to set default repository type?&quot;
    }
  ],
```

- &#39;#&#39; indicate that is necesary to use a function in the shot in order to resolve the type value.
- &#39;()&#39; set that pisco needs to execute this function on order to get the value. 

shot.js
```
  setType: function() {
    return &#39;confirm&#39;;
  },
```

#### this.inquire

| Param | Description |
| --- | --- |
| | |

