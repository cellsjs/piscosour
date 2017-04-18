# skipper plugin

This plugin implements `core-check` hook

## <a name="core-check"></a>core-check hook

The hook `core-check` is skipped when the step receive a parameter `_skip: true`.

Once skipped the stdout will show the following message:

```sh
[17:00:02] core-check skip step execution
```
