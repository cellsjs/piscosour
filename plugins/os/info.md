# os plugin

Plugin to check Operating System where pisco is running

1. [isMac() addon](#isMac)
1. [isWin() addon](#isWin)

## <a name="isMac"></a>1. isMac() addon

`this.isMac()` is a syncronous method that returns a `true` when the operating system is a Mac OS.

Example:

```javascript
run: function(resolve, reject) {
  this.logger('mac?', this.isMac());
  return true;
}
```

## <a name="isWin"></a>2. isWin() addon

`this.isWin()` is a syncronous method that returns a `true` when the operating system is a Windows OS.

Example:

```javascript
run: function(resolve, reject) {
  this.logger('windows?', this.isWindow());
  return true;
}
```
