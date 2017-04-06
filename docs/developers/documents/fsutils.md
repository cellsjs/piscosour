---
title: fsutils
name: fsutils
type: plugins
layout: api_doc.html
---
# Plugins: fsutils


# fsUtils plugin

Some file I/O addons are provided:

1. [fsCreateDir() addon](#fsCreateDir)
1. [fsExists() addon](#fsExists)
1. [fsReadConfig() addon](#fsReadConfig)
1. [fsReadFile() addon](#fsReadFile)
1. [fsCopyDirFiltered() addon](#fsCopyDirFiltered)
1. [fsCopyFileFiltered() addon](#fsCopyFileFiltered)
1. [fsAppendBundle() addon](#fsAppendBundle)

## <a name="fsCreateDir"></a>fsCreateDir

`this.fsCreateDir(dirName)` attempts to create synchronously a directory named `dirName`.

| Param | Description |
| --- | --- |
| dir | name of the directory to crate |

Example:

```javascript
run: function() {
  this.fsCreate('test');
}
```

## <a name="fsExists"></a>fsExists

`this.fsExists(filename)` check synchronously if a element named `filename` exists and returns a boolean.

| Param | Description |
| --- | --- |
| filename | name of the element to test is exists |

Example:

```javascript
run: function() {
  let exist = this.fsExists('sample');
}
```

## <a name="fsReadConfig"></a>fsReadConfig

`this.fsReadConfig(filename)` attemps to read synchronously a JSON file named `filename` exists, and returns an object with the `json`.

| Param | Description |
| --- | --- |
| filename | name of the json file |

Example:

```javascript
run: function() {
  let json = this.fsReadConfig('sample.json')
}
```

## <a name="fsReadFile"></a>fsReadFile

| Param | Description |
| --- | --- |
| name | name of the context to test|

## <a name="fsCopyDirFiltered"></a>fsCopyDirFiltered

| Param | Description |
| --- | --- |
| name | name of the context to test|

## <a name="fsCopyFileFiltered"></a>fsCopyFileFiltered

| Param | Description |
| --- | --- |
| name | name of the context to test|

## <a name="fsAppendBundle"></a>fsAppendBundle

| Param | Description |
| --- | --- |
| name | name of the context to test|


