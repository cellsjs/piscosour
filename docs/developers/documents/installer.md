---
title: installer
name: installer
type: plugins
layout: api_doc.html
---
# Plugins: installer


# installer plugin

This plugins install all recipes needed for the execution with the `core-install` hook:

## core-install hook:

Performs installations of the compatible [requirements](../guides/10-requirements.md) version for all recipes needed.

Example of config.json:

```json
{
  "requirements": {
    "polymer" : {
      "installer": "bower",
      "listedIn": "bower",
      "uri": "https://github.com/Polymer/polymer.git#v1.6.1",
      "regexp": "=(.*?)"
    }
  }
}
```

See [requirements documentation](../guides/10-requirements.md) for more information.



