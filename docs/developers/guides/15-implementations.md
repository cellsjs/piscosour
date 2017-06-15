---
title: Implementations
layout: doc_page.html
order: 15
---

# Implementations

This is a very important concept of a recipe. Any step on a recipe could be implemented by one single step inside another recipe. Using this concept is possible to implement same flow in different ways on each recipe. 
By default all steps in a flows have to be implemented otherwise the execution of the flow would end on error. With `implementation-check` parameter on flows is possible to disable this check [See implementation-check on flows](./03-flows.md) 

How to do this. Inside piscosour.json of your recipe you can place the object `implementations` with, for example, this aspect:

```json
 "implementations" : {
    "resolve-deps": {
      "app": "pisco-cells-app-resolve@^0.1.0",
      "component": "not-build",
      "android-app": "pisco-cells-android-app-resolve-deps@^0.1.0",
      "ios-app": "pisco-cells-ios-app-resolve-deps@^0.1.0"
    },
    "build": {
      "app": "pisco-cells-app-build@^0.1.0",
      "component" : "not-build",
      "iconset": "pisco-cells-iconset-create@^0.1.2",
      "catalog": "pisco-cells-catalog-build@^0.1.0",
      "android-app": "pisco-cells-android-app-build@^0.1.0",
      "ios-app": "pisco-cells-ios-app-build@^0.2.0"
    },
    .....
 }
```

`IMPORTANT:` All recipes are installed globally so if you have more than one recipe installed that implements the same step in the same contexts. Executions is going to fail with this error:

```shell
[18:13:32] step build is overwritten by step: "other recipe" in recipe "your recipe");
```

## Implementations Object

This is the structure of the object:

```
- implementations
    - ${step name}
        - ${context}: ${dependency}
```

### step name

Is the name of the step. In config.json of the step [see step documentation for more info](./02-steps.md)
  
### context:

Name of the context implemented. In config.json of the step [see step documentation for more info](./02-steps.md)

### dependency:

Is a string containing the npm module or git repository with version where the implementation resides. With this format:

- ${npm_module_name}@${semver_version}
- ${git_repository}#${version_or_tag}
- `"not-build"` this literal means that this step is not implemented but do not fail with check implementation.

for example:

```json
    "build": {
      "app": "pisco-cells-app-build@^0.1.0",
      "migration": "https://github.com/cellsjs/cells-migration-tool.git#0.1.0",
      "app-configuration" : "not-build"
    }
```

