# Options

## port

Type: `Integer`
Default: `8000`

## hostname

Type: `String`
Default: `localhost`

## base

Type: `String`
Default: `.`

Base directory.

## keepalive

Type: `Boolean`
Default: `false`

Keep the server alive after the task has finished.

## middleware

Type: `Function`
Default:

```js
function(connect, options) {
  return [
    connect.static(options.base),
    connect.directory(options.base)
  ];
}
```

Lets you to add in your own Connect middlewares.

The option expects a function that returns and array of middlewares. See example in the Gruntfile.
