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
Default: `'0.0.0.0'`

The hostname the webserver will use.

Setting it to `'*'` will make the server accessible from anywhere.

## base
Type: `String` or `Array`  
Default: `'.'`

The base (or root) directory from which files will be served. Defaults to the project Gruntfile's directory.

Can be an array of bases to serve multiple directories. The last base given will be the directory to become browse-able.

## directory
Type: `String`  
Default: `null`

Set to the directory you wish to be browse-able. Used to override the `base` option browse-able directory.

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

## open
Type: `Boolean` or `String` or `Object`
Default: `false`

Open the served page in your default browser. Specifying `true` opens the default server URL, specifying a URL opens that URL or specify an object with the following keys to configure open directly (each are optional):

```js
{
  target: 'http://localhost:8000', // target url to open
  appName: 'open', // name of the app that opens, ie: open, start, xdg-open
  callback: function() {} // called when the app has opened
}
```

## middleware
Type: `Function`  
Default:

```js
grunt.initConfig({
  connect: {
    server: {
      options: {
        middleware: function(connect, options) {
          var middlewares = [];
          if (!Array.isArray(options.base)) {
            options.base = [options.base];
          }
          var directory = options.directory || options.base[options.base.length - 1];
          options.base.forEach(function(base) {
            // Serve static files.
            middlewares.push(connect.static(base));
          });
          // Make directory browse-able.
          middlewares.push(connect.directory(directory));
          return middlewares;
        },
      },
    },
  },
});
```

Lets you add in your own Connect middlewares. This option expects a function that returns an array of middlewares. See the [project Gruntfile][] and [project unit tests][] for a usage example.

[project Gruntfile]: Gruntfile.js
[project unit tests]: test/connect_test.js
