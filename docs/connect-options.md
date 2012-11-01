# Options

## port
Type: `Integer`  
Default: `8000`

The port on which the webserver will respond.

## hostname
Type: `String`  
Default: `localhost`

The hostname the webserver will use.

## base
Type: `String`  
Default: `.`

The base (or root) directory from which files will be served. The default directory is the same directory as the project's gruntfile.

## keepalive
Type: `Boolean`  
Default: `false`

Keep the server alive indefinitely. Note that if this option is enabled, any tasks specified after this task will _never run_. By default, once grunt's tasks have completed, the web server stops.

This option can be enabled ad-hoc by running the task like `grunt connect:keepalive`

## middleware
Type: `Function`  
Default:

```js
function(connect, options) {
  return [
    // Serve static files.
    connect.static(options.base),
    // Make empty directories browsable.
    connect.directory(options.base),
  ];
}
```

Lets you add in your own Connect middlewares. This option expects a function that returns an array of middlewares.
