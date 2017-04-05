---
title: userConfig
name: userConfig
type: plugins
layout: api_doc.html
---
# Plugins: userConfig


### Functions to work with the user configuration file ($HOME/.piscosour/piscosour.json)

### Addons:

#### this.userConfigRead

Returns an object containing the user configuration, or an empty object if the file is not found.

| Param | Description |
| --- | --- |

#### this.userConfigWrite

Serializes the input object as JSON and writes it to the user config file. If the file does not exists, creates it.
Returns the input object.

| Param | Description |
| --- | --- |
| userConfig | Object containing the user configuration to write |

#### this.userConfigGet

Returns the value associated with the key in the user config, or null if not found.

| Param | Description |
| --- | --- |
| key | Key whose mapped value is wanted |

#### this.userConfigSet

Maps the value to the key in the user config, and writes it to the file.
Returns the user config object.

| Param | Description |
| --- | --- |
| key | Key to associate to the value |
| value | Value associated to the key |


