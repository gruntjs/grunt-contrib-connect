# Options

## port
Type: `Integer`
Default: `8000`

The port on which the webserver will respond. The task will fail if the specified port is already in use. You can use the special values `0` or `'?'` to use a system-assigned port.

## protocol
Type: `String`
Default: `'http'`

May be `'http'` or `'https'`.

## hostname
Type: `String`
Default: `'localhost'`

The hostname the webserver will use.

Setting it to `'*'` will make the server accessible from anywhere.

## base
Type: `String` or `Array`
Default: `'.'`

The base (or root) directory from which files will be served. Defaults to the project Gruntfile's directory.

Can be an array of bases to serve multiple directories.

## keepalive
Type: `Boolean`
Default: `false`

Keep the server alive indefinitely. Note that if this option is enabled, any tasks specified after this task will _never run_. By default, once grunt's tasks have completed, the web server stops. This option changes that behavior.

This option can also be enabled ad-hoc by running the task like `grunt connect:targetname:keepalive`

## debug
Type: `Boolean`
Default: `false`

Set the `debug` option to true to enable logging instead of using the `--debug` flag.

## livereload
Type: `Boolean` or `Number`
Default: `false`

Set to `true` or a port number to inject a live reload script tag into your page using [connect-livereload](https://github.com/intesso/connect-livereload).

*This does not perform live reloading. It is intended to be used in tandem with grunt-contrib-watch or another task that will trigger a live reload server upon files changing.*

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

Lets you add in your own Connect middlewares. This option expects a function that returns an array of middlewares. See the [project Gruntfile][] and [project unit tests][] for a usage example.

[project Gruntfile]: Gruntfile.js
[project unit tests]: test/connect_test.js
