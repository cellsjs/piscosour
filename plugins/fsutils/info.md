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

`this.fsReadFile(filename)` attemps to read synchronously a text file named `filename` exists, and returns a string with the contain.

| Param | Description |
| --- | --- |
| filename | name of the file |

Example:

```javascript
run: function() {
  let contain = this.fsReadConfig('sample.json')
}
```

