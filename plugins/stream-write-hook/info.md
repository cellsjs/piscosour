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

## <a name="streamWriteHook"></a>1. streamWriteHook() addon

Starts the hook to intercept any stream.

| Param | Type | Description |
| --- | --- | --- |
| stream | Object | Stream to be hooked |
| cb | function | Function to call each time chunk is append to stream. |

Where the `cb` function could received the following parameters:

| Param | Type | Description |
| --- | --- | --- |
| chunck | string \| Object | Can be a string or a buffer. If chunk is a string, the parameter `encoding` specifies how to encode it into a byte stream |
| encoding | string | By default the encoding is 'utf8' |
| callback | function | callback will be called when this chunk of data is flushed. |

Example:

```javascript
   let capture = '';
   this.streamWriteHook(process.stdout, function(chunk, encoding, cb) {
     capture += stripcolorcodes(chunk.toString(encoding));
   });
```

Where `stripcolorcodes()` is used to deleting all coloured characters from stream. And `capture` will contain all from content of process.stdout without coloured character. 

## <a name="streamWriteUnhook"></a>2. streamWriteUnhook() addon

Stops the hook

| Param | Type | Description |
| --- | --- | --- |
| stream | Object | Stream to be Unhooked |

Example:

```javascript
   this.streamWriteUnhook(process.stdout);
```
