# grunt-contrib-connect v5.0.1 [![Build Status](https://github.com/gruntjs/grunt-contrib-connect/workflows/Tests/badge.svg)](https://github.com/gruntjs/grunt-contrib-connect/actions?workflow=Tests)

> Start a connect web server



## Getting Started

If you haven't used [Grunt](https://gruntjs.com/) before, be sure to check out the [Getting Started](https://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](https://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-contrib-connect --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-contrib-connect');
```




## Connect task
_Run this task with the `grunt connect` command._

Note that this server only runs as long as grunt is running. Once grunt's tasks have completed, the web server stops. This behavior can be changed with the [keepalive](#keepalive) option, and can be enabled ad-hoc by running the task like `grunt connect:keepalive`.

This task was designed to be used in conjunction with another task that is run immediately afterwards, like the [grunt-contrib-qunit plugin](https://github.com/gruntjs/grunt-contrib-qunit) `qunit` task.
### Options

#### port
Type: `Integer`  
Default: `8000`

The port on which the webserver will respond. The task will fail if the specified port is already in use (unless [useAvailablePort](#useavailableport) is set). You can use the special values `0` or `'?'` to use a system-assigned port.

#### protocol
Type: `String`  
Default: `'http'`

May be `'http'`, `'http2'` or `'https'`.

#### hostname
Type: `String`  
Default: `'0.0.0.0'`

The hostname on which the webserver can be accessed.

Setting it to `'*'`, like '`0.0.0.0`', will make the server accessible from any **local** IPv4 address like  `'127.0.0.1'` and the IP assigned to an ethernet or wireless interface (like `'192.168.0.x'` or `'10.0.0.x'`). [More info](https://en.wikipedia.org/wiki/0.0.0.0)

If [`open`](#open) is set to `true`, the `hostname` setting will be used to generate the URL that is opened by the browser, defaulting to `localhost` if a wildcard hostname was specified.

#### base
Type: `String` or `Array` or `Object`  
Default: `'.'`

| Type     | Result                                                                                                                                           | Example                                              |
| ---      | :---                                                                                                                                             | ---                                                  |
| *String* | The base (or root) directory from which files will be served. Defaults to the project Gruntfile's directory.                                     | `'public'`                                           |
| *Array*  | Array of `String` (or `Object`) bases to serve multiple directories. The last base given will be the [directory][] to become browse-able.        | `['public','www-root']`                              |
| *Object* | Map containing `path` and `options` keys. `options` are passed on to the [serve-static](https://www.npmjs.com/package/serve-static) module. | `{ path: 'public', options: { maxAge: 1000*60*5 } }` |


#### directory
Type: `String`  
Default: `null`

Set to the directory you wish to be browse-able. Used to override the `base` option browse-able directory.

See https://www.npmjs.com/package/serve-index for details.

#### keepalive
Type: `Boolean`  
Default: `false`

Keep the server alive indefinitely. Note that if this option is enabled, any tasks specified after this task will _never run_. By default, once grunt's tasks have completed, the web server stops. This option changes that behavior.

This option can also be enabled ad-hoc by running the task like `grunt connect:targetname:keepalive`

#### debug
Type: `Boolean`  
Default: `false`

Set the `debug` option to true to enable logging instead of using the `--debug` flag.

#### livereload
Type: `Boolean`, `Number`, or `Object`  
Default: `false`

Set to anything but `false` to inject a live reload script tag into your page using [connect-livereload](https://github.com/intesso/connect-livereload).

If you set to `true`, defaults are used. If you set to a number, that number is used as a port number, together with the hostname you configured. If you set this to an object, that object is passed to `connect-livereload` unchanged as its configuration.

*This does not by itself perform live reloading.* It is intended to be used in tandem with grunt-contrib-watch or another task that will trigger a live reload server upon files changing.

#### open
Type: `Boolean` or `String` or `Object`  
Default: `false`

Open the served page in your default browser.

This can be one of the following:

- Specifying `true` opens the default server URL (generated from the [`protocol`](#protocol), [`hostname`](#hostname) and [`port`](#port) settings)
- Specifying a URL opens that URL
- Specify an object with the following keys to configure [opn](https://www.npmjs.com/package/opn) directly:

	```js
	{
	  target: 'http://localhost:8000', // target url to open
	  appName: 'open', // name of the app that opens, ie: open, start, xdg-open
	  callback: function() {} // called when the app has opened
	}
	```

Note that in [v0.9.0](https://github.com/gruntjs/grunt-contrib-connect/releases/tag/v0.9.0) [open](https://www.npmjs.com/package/open) was replaced with [opn](https://www.npmjs.com/package/opn) but the configuration remained the same for backwards compatibility. `target`, `appName` and `callback` are the only supported keys in the config object.

#### useAvailablePort
Type: `Boolean`  
Default: `false`

If `true` the task will look for the next available port after the set `port` option.

#### onCreateServer
Type: `Function` or `Array`  
Default: `null`

A function to be called after the server object is created, to allow integrating libraries that need access to connect's server object. A Socket.IO example:

```js
grunt.initConfig({
  connect: {
    server: {
      options: {
        port: 8000,
        hostname: '*',
        onCreateServer: function(server, connect, options) {
          var io = require('socket.io').listen(server);
          io.sockets.on('connection', function(socket) {
            // do something with socket
          });
        }
      }
    }
  }
});
```

#### middleware
Type: `Function` or `Array`  
Default: `Array` of connect middlewares that use `options.base` for static files and directory browsing

As an `Array`:

```js
grunt.initConfig({
  connect: {
    server: {
      options: {
        middleware: [
          function myMiddleware(req, res, next) {
            res.end('Hello, world!');
          }
        ],
      },
    },
  },
});
```

As a `function`:

```js
grunt.initConfig({
  connect: {
    server: {
      options: {
        middleware: function(connect, options, middlewares) {
          // inject a custom middleware into the array of default middlewares
          middlewares.unshift(function(req, res, next) {
            if (req.url !== '/hello/world') return next();

            res.end('Hello, world from port #' + options.port + '!');
          });

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

### Usage examples

#### Basic Use
In this example, `grunt connect` (or more verbosely, `grunt connect:server`) will start a static web server at `http://localhost:9001/`, with its base path set to the `www-root` directory relative to the gruntfile, and any tasks run afterwards will be able to access it.

```js
// Project configuration.
grunt.initConfig({
  connect: {
    server: {
      options: {
        port: 9001,
        base: 'www-root'
      }
    }
  }
});
```

If you want your web server to use the default options, just omit the `options` object. You still need to specify a target (`uses_defaults` in this example), but the target's configuration object can otherwise be empty or nonexistent. In this example, `grunt connect` (or more verbosely, `grunt connect:uses_defaults`) will start a static web server using the default options.

```js
// Project configuration.
grunt.initConfig({
  connect: {
    uses_defaults: {}
  }
});
```

#### Multiple Servers
You can specify multiple servers to be run alone or simultaneously by creating a target for each server. In this example, running either `grunt connect:site1` or `grunt connect:site2` will  start the appropriate web server, but running `grunt connect` will run _both_. Note that any server for which the [keepalive](#keepalive) option is specified will prevent _any_ task or target from running after it.

```js
// Project configuration.
grunt.initConfig({
  connect: {
    site1: {
      options: {
        port: 9000,
        base: 'www-roots/site1'
      }
    },
    site2: {
      options: {
        port: 9001,
        base: 'www-roots/site2'
      }
    }
  }
});
```

#### Static Options

Options for the serve-static module. See [serve-static](https://www.npmjs.com/package/serve-static):

```js
grunt.initConfig({
  connect: {
    server: {
      options: {
        port: 8000,
        base: {
          path: 'www-root',
          options: {
            index: 'somedoc.html',
            maxAge: 300000
          }
        }
      }
    }
  }
});
```



#### 

#### Roll Your Own
Like the [Basic Use](#basic-use) example, this example will start a static web server at `http://localhost:9001/`, with its base path set to the `www-root` directory relative to the gruntfile. Unlike the other example, this is done by creating a brand new task. in fact, this plugin isn't even installed!

```js
// Project configuration.
grunt.initConfig({ /* Nothing needed here! */ });

// After running "npm install connect serve-static --save-dev" to add connect as a dev
// dependency of your project, you can require it in your gruntfile with:
var connect = require('connect');
var serveStatic = require('serve-static');
connect(serveStatic('www-root')).listen(9001);

// Now you can define a "connect" task that starts a webserver, using the
// connect lib, with whatever options and configuration you need:
grunt.registerTask('connect', 'Start a custom static web server.', function() {
  grunt.log.writeln('Starting static web server in "www-root" on port 9001.');
  connect(serveStatic('www-root')).listen(9001);
});
```

#### Support for HTTPS / HTTP2

A default certificate authority, certificate and key file are provided and pre-
configured for use when `protocol` has been set to `https`.

NOTE: No passphrase set for the certificate.
If you are getting warnings in Google Chrome, add 'server.crt' (from 'node_modules/tasks/certs')
to your keychain.
In OS X, after you add 'server.crt', right click on the certificate,
select 'Get Info' - 'Trust' - 'Always Trust', close window, restart Chrome.

For HTTPS / HTTP2 livereload with [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch) 
 see the last example [here](https://github.com/gruntjs/grunt-contrib-watch#optionslivereload).

###### Advanced HTTPS / HTTP2 config

If the default certificate setup is unsuitable for your environment, OpenSSL
can be used to create a set of self-signed certificates with a local ca root.

```shell
### Create ca.key, use a password phrase when asked
### When asked 'Common Name (e.g. server FQDN or YOUR name) []:' use your hostname, i.e 'mysite.dev'
openssl genrsa -des3 -out ca.key 1024
openssl req -new -key ca.key -out ca.csr
openssl x509 -req -days 365 -in ca.csr -out ca.crt -signkey ca.key

### Create server certificate
openssl genrsa -des3 -out server.key 1024
openssl req -new -key server.key -out server.csr

### Remove password from the certificate
cp server.key server.key.org
openssl rsa -in server.key.org -out server.key

### Generate self-siged certificate
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

For more details on the various options that can be set when configuring SSL,
please see the Node documentation for [TLS][].

Grunt configuration would become

```js
// Project configuration.
grunt.initConfig({
  connect: {
    server: {
      options: {
        protocol: 'https', // or 'http2'
        port: 8443,
        key: grunt.file.read('server.key').toString(),
        cert: grunt.file.read('server.crt').toString(),
        ca: grunt.file.read('ca.crt').toString()
      },
    },
  },
});
```

[TLS]: https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener

#### Grunt Events
The connect plugin will emit a grunt event, `connect.{taskName}.listening`, once the server has started. You can listen for this event to run things against a keepalive server, for example:

```js
grunt.registerTask('jasmine-server', 'start web server for jasmine tests in browser', function() {
  grunt.task.run('jasmine:tests:build');

  grunt.event.once('connect.tests.listening', function(host, port) {
    var specRunnerUrl = 'http://' + host + ':' + port + '/_SpecRunner.html';
    grunt.log.writeln('Jasmine specs available at: ' + specRunnerUrl);
    require('open')(specRunnerUrl);
  });

  grunt.task.run('connect:tests:keepalive');
});
```


## Release History

 * 2024-08-27   v5.0.1   Replace use of deprecated `util.isArray`.
 * 2024-07-05   v5.0.0   Replaced node-http2 with http2-wrapper, potental breaking changes. Bump to deps, serve-static, async and internal grunt
 * 2023-07-13   v4.0.0   Requires node 16+. Updated dependencies.
 * 2020-07-16   v3.0.0   Requires node 10+. Updated dependencies.
 * 2019-09-03   v2.1.0   Update package lock. Allow all configuration options of livereload to be passed through.
 * 2018-09-09   v2.0.0   Drop Node.js < 6 support. Update all dependencies and switch to `node-http2`. Add `secureProtocol` in `httpsOptions`. Fix `open.appName`. Allow passing `serve-index` options.
 * 2016-04-27   v1.0.2   Fixed http2 dependencies and stopped using the fork.
 * 2016-03-22   v1.0.1   Fixed dependencies behind corporate proxy server.
 * 2016-03-04   v1.0.0   Use predefined logger format with colored http status. Update deps and docs. HTTP2 support. Other fixes.
 * 2015-08-03   v0.11.2   Documentation fixes.
 * 2015-08-01   v0.11.1   Fixes debug logging.
 * 2015-07-30   v0.11.0   Update to connect 3.
 * 2015-04-03   v0.10.1   Fixes npm corruption issue.
 * 2015-04-03   v0.10.0   Node.js 0.12 fixes. Doc updates. Fixes port finding. Other fixes.
 * 2014-11-07   v0.9.0   Adds routable middleware. Switch to `opn` as it fixes some Linux issues. Add support for `connect.static` instance options.
 * 2014-06-09   v0.8.0   Update connect and connect-livereload.
 * 2014-02-27   v0.7.1   Fixes issue with the '*' `hostname` option.
 * 2014-02-18   v0.7.0   Update connect to ~2.13.0. Default hostname switched to `0.0.0.0`. Modified `options.middleware` to accept an array or a function.
 * 2013-12-29   v0.6.0   Open `options.hostname` if provided. Update connect-livereload to ~0.3.0. Update connect to ~2.12.0. Use well-formed SSL certificates. Support all options of open. Make directory browseable when base is a string.
 * 2013-09-05   v0.5.0   Add `open` option.
 * 2013-09-05   v0.4.2   Un-normalize `options.base` as it should be a string or an array as the user has set. Fix setting target `hostname` option.
 * 2013-09-02   v0.4.1   Browse-able directory is the last item supplied to bases. Added directory option to override browse-able directory.
 * 2013-09-01   v0.4.0   Fix logging of which server address. Ability to set multiple bases. Event emitted when server starts listening. Support for HTTPS. `debug` option added to display debug logging like the `--debug` flag. `livereload` option added to inject a livereload snippet into the page.
 * 2013-04-10   v0.3.0   Add ability to listen on system-assigned port.
 * 2013-03-07   v0.2.0   Upgrade connect dependency.
 * 2013-02-17   v0.1.2   Ensure Gruntfile.js is included on npm.
 * 2013-02-15   v0.1.1   First official release for Grunt 0.4.0.
 * 2013-01-18   v0.1.1rc6   Updating grunt/gruntplugin dependencies to rc6. Changing in-development grunt/gruntplugin dependency versions from tilde version ranges to specific versions.
 * 2013-01-09   v0.1.1rc5   Updating to work with grunt v0.4.0rc5.
 * 2012-11-01   v0.1.0   Work in progress, not yet officially released.

---

Task submitted by ["Cowboy" Ben Alman](http://benalman.com)

*This is a generated file.*
