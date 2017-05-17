# launcher plugin

This plugins provides the ability to spawn child processes with different implemented ways:

1. [sh() addon](#sh)
1. [sudo() addon](#sudo)
1. [execute() addon](#execute)
1. [executeMassive() addon](#executeMassive)
1. [executeParallel() addon](#executeParallel)
1. [executeSync() addon](#executeSync)
1. [executeStreamed() addon](#executeStreamed)

## <a name="sh"></a>1. sh() addon

`this.sh(command, reject, loud)` is a syncronous method to execute a `command` in your environment. If fails `reject` function is called.

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| command | String | No | The command that you want to execute |
| reject | function | Yes | reject function, called if command fails (stop overall execution) |
| loud | boolean | Yes | If true echo of command is done |

Example:

```javascript
run: function(resolve, reject) {
  return this.sh('echo sample', reject, true);
}
```

## <a name="sudo"></a>2. sudo() addon

`this.sudo(command)` execute a `command` in your environment as a administrator (or root) and returns a [stream](https://nodejs.org/api/stream.html).

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| command | String | No | The command and parameters |

Example:

```javascript
run: function(resolve, reject) {
  let stream = this.sudo('echo my sample');
  stream.on('close', (code) => {
    this.logger.info('close with code ', code);
    if (code !== 0) {
      reject();
    } else {
      resolve();
    }
  });

  return true;
}
```

## <a name="execute"></a>3. execute() addon

`this.execute(command, arguments, options)` returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that will execute a `command` with `arguments` in your environment.

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| command | String | No | The command name |
| arguments | Array | Yes | The list of arguments |
| options | Object | Yes | Options in the execution of the process, see [options](#options) |

`options` allows these [configurations](#options), and in addition allows these properties:

| Property | Type | Description |
| --- | --- | --- |
| mute | boolean | If true no log appears in stdin |


Example:

```javascript
run: function(resolve, reject) {
  return this.execute('echo', ['my', 'sample'], { 'mute': true })
      .then(resolve, reject);
}
```

## <a name="executeMassive"></a>4. executeMassive() addon

`this.executeMassive(descriptors, jobs)` returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to [execute](#execute) in parallel a list of processed defined with `descriptors`. The limit of parallel process is defined by `jobs`

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| descriptors | Array of Objects | No | Array of {cmd, arguments, options} |
| jobs | number | No | number of parallel jobs |

Where `descriptors` is an array of objects needed to [execute a command](#execute) with the following properties:

| Property | Type | Description |
| --- | --- | --- |
| cmd | String | Command name to execute |
| args | Array | The list of command arguments |
| options | Object | Options in the execution of the process, see [options](#options) |

Example:

```javascript
run: function(resolve, reject) {
  return this.executeMassive(
    [
      { 'cmd': 'echo', 'args': [ 'exec1' ], 'options': {} },
      { 'cmd': 'sleep', 'args': [ '5' ], 'options': {} },
      { 'cmd': 'echo', 'args': [ 'exec2' ], 'options': {} },
      { 'cmd': 'sleep', 'args': [ '5' ], 'options': {} },
      { 'cmd': 'echo', 'args': [ 'exec3' ], 'options': {} },
      { 'cmd': 'sleep', 'args': [ '5' ], 'options': {} },
      { 'cmd': 'echo', 'args': [ 'exec4' ], 'options': {} },
      { 'cmd': 'sleep', 'args': [ '5' ], 'options': {} },
      { 'cmd': 'echo', 'args': [ 'exec5' ], 'options': {} },
      { 'cmd': 'sleep', 'args': [ '5' ], 'options': {} },
      { 'cmd': 'echo', 'args': [ 'exec6' ], 'options': {} },
      { 'cmd': 'sleep', 'args': [ '5' ], 'options': {} }
    ], 2).then(resolve, reject);
}
```

Display the following log in the console:

```sh
[20:31:18] run stage running...
exec1
[20:31:18] echo exec1 executed: OK
[20:31:23] sleep 5 executed: OK
[20:31:23] sleep 5 executed: OK
exec2
[20:31:23] echo exec2 executed: OK
exec3
[20:31:23] echo exec3 executed: OK
[20:31:28] sleep 5 executed: OK
exec4
[20:31:28] echo exec4 executed: OK
[20:31:28] sleep 5 executed: OK
exec5
[20:31:28] echo exec5 executed: OK
[20:31:33] sleep 5 executed: OK
[20:31:33] sleep 5 executed: OK
exec6
[20:31:33] echo exec6 executed: OK
```

## <a name="executeParallel"></a>5. executeParallel() addon

`this.executeParallel(descriptors)` returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to [execute](#execute) in parallel all the list of processed defined with `descriptors`.

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| descriptors | Array of Objects | No | Array of {cmd, args, options} |

Where `descriptors` is an array of objects needed to [execute a command](#execute) with the following properties:

| Property | Type | Description |
| --- | --- | --- |
| cmd | String | Command name to execute |
| args | Array | The list of command arguments |
| options | Object | Options in the execution of the process, see [options](#options) |

Example:

```javascript
run: function(resolve, reject) {
  return this.executeParallel(
    [
      { 'cmd': 'echo', 'args': [ 'exec1' ], 'options': {} },
      { 'cmd': 'sleep', 'args': [ '5' ], 'options': {} },
      { 'cmd': 'echo', 'args': [ 'exec2' ], 'options': {} },
      { 'cmd': 'sleep', 'args': [ '5' ], 'options': {} },
      { 'cmd': 'echo', 'args': [ 'exec3' ], 'options': {} },
      { 'cmd': 'sleep', 'args': [ '5' ], 'options': {} },
      { 'cmd': 'echo', 'args': [ 'exec4' ], 'options': {} },
      { 'cmd': 'sleep', 'args': [ '5' ], 'options': {} },
      { 'cmd': 'echo', 'args': [ 'exec5' ], 'options': {} },
      { 'cmd': 'sleep', 'args': [ '5' ], 'options': {} },
      { 'cmd': 'echo', 'args': [ 'exec6' ], 'options': {} },
      { 'cmd': 'sleep', 'args': [ '5' ], 'options': {} }
    ]).then(resolve, reject);
}
```

Display the following log in the console:

```sh
[20:38:50] run stage running...
exec1
exec2
exec3
exec4
exec5
exec6
[20:38:50] echo exec5 executed: OK
[20:38:50] echo exec4 executed: OK
[20:38:50] echo exec3 executed: OK
[20:38:50] echo exec2 executed: OK
[20:38:50] echo exec1 executed: OK
[20:38:50] echo exec6 executed: OK
[20:38:55] sleep 5 executed: OK
[20:38:55] sleep 5 executed: OK
[20:38:55] sleep 5 executed: OK
[20:38:55] sleep 5 executed: OK
[20:38:55] sleep 5 executed: OK
[20:38:55] sleep 5 executed: OK
```

### <a name="executeSync"></a>6. executeSync() addon

`this.executeSync(command, arguments, reject, loud)` executes synchronously a `command` with a list of `arguments`.

| Param | Type | Optional | Description |
| --- | --- | --- | --- |
| command | String | No | The command name to execute |
| arguments | Array | No | The arguments of the command |
| reject | function | Yes | If fails the execution, then this function callback will be executed |
| loud | boolean | Yes | By default is false. If true, then `options.stdio` configuration will be `{ stdio: ['ignore', process.stdout, process.stderr] }`. See [options.stdio](https://nodejs.org/api/child_process.html#child_process_options_stdio). |

Example:

```javascript
run: function(resolve, reject) {
  this.executeSync('echo', [ '1', '2', '3' ], reject);
  resolve();
}
```

## <a name="executeStreamed"></a>7. executeStreamed() addon

`this.executeStreamed(command, arguments, options)` executes a `command` with some `arguments` and returns a [stream](https://nodejs.org/api/stream.html).

| Property | Type | Optional | Description |
| --- | --- | --- |--- |
| cmd | String | No | Command name to execute |
| arguments | Array | Yes | The list of command arguments |
| options | Object | Yes | Options in the execution of the process, see [options](#options)|

<a name="options"></a>`options` is an object and allows the following [properties of nodejs spawn](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options):

| Property | Type | Description |
| --- | --- | --- |
| cwd | string | Current working directory of the child process |
| env | Object | Environment key-value pairs |
| argv0 | string | Explicitly set the value of argv[0] sent to the child process. This will be set to command if not specified. |
| stdio | Array or String | Child's stdio configuration. (See [options.stdio](https://nodejs.org/api/child_process.html#child_process_options_stdio))
| detached | boolean | Prepare child to run independently of its parent process. Specific behavior depends on the platform, see [options.detached](https://nodejs.org/api/child_process.html#child_process_options_detached)) |
| uid | number | Sets the user identity of the process. (See [setuid(2)](http://man7.org/linux/man-pages/man2/setuid.2.html)) |
| gid | number | Sets the group identity of the process. (See [setgid(2)](http://man7.org/linux/man-pages/man2/setuid.2.html)) 
| shell | boolean or String | If true, runs command inside of a shell. Uses '/bin/sh' on UNIX, and 'cmd.exe' on Windows. A different shell can be specified as a string. The shell should understand the -c switch on UNIX, or /d /s /c on Windows. Defaults to false (no shell). |

Example:

```javascript
run: function(resolve, reject) {
  let stream = launcher.executeStreamed('echo', [ '1' ], {});
  stream.on('close', (code) => {
    this.logger.info('close with code ', code);
    if (code !== 0) {
      reject();
    } else {
      resolve();
    }
  }
  return true;
}
```

