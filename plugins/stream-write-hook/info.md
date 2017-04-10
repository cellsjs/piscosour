# stream-write-hook plugin

Plugin to intercepts any stream flow in order to be able to manage the information inside.

This way you can capture all the output of any stream and do whatever you want with it. The way to do this has two stages:

**1. Start intercepting the stream**

At any place in yor code is posible to intercept any stream the only thing you have to do is use `streamWriteHook` method:

```javascript
   let capture = '';
   this.streamWriteHook(process.stdout, function(chunk, encoding, cb) {
     capture += chunk.toString(encoding);
   });
```
  
Capture will contain all from content of process.stdout

**2. Stop intercepting the stream.**

Is necesary to do release all system resources, so do this:

```javascript
   this.streamWriteUnhook(process.stdout);
```

Two addons are defined:

1. [streamWriteHook() addon](#streamWriteHook)
1. [streamWriteUnhook() addon](#streamWriteUnhook)

## <a name="streamWriteHook"></a>streamWriteHook() addon

Starts the hook

| Param | Type | Description |
| --- | --- | --- |
| stream | Object | Stream to be hooked |
| cb | function | Function to call each time chunk is append to stream |

Example:

```javascript
   let capture = '';
   this.streamWriteHook(process.stdout, function(chunk, encoding, cb) {
     capture += stripcolorcodes(chunk.toString(encoding));
   });
```

(*) stripcolorcodes() is used to deleting all coloured characters from stream. 

## <a name="streamWriteUnhook"></a>streamWriteUnhook() addon

Stops the hook

| Param | Type | Description |
| --- | --- | --- |
| stream | Object | Stream to be Unhooked |

Example:

```javascript
   this.streamWriteUnhook(process.stdout);
```
