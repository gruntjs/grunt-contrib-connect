# grunt-contrib-connect [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-connect.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-connect)

> Start a connect web server.

_Note that this plugin has not yet been released, and only works with the latest bleeding-edge, in-development version of grunt. See the [When will I be able to use in-development feature 'X'?](https://github.com/gruntjs/grunt/blob/devel/docs/faq.md#when-will-i-be-able-to-use-in-development-feature-x) FAQ entry for more information._

## Getting Started
If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide, as it explains how to create a [gruntfile][Getting Started] as well as install and use grunt plugins. Once you're familiar with that process, install this plugin with this command:

```shell
npm install grunt-contrib-connect --save-dev
```

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md


## Connect task
_Run this task with the `grunt connect` command._

Note that this server only runs as long as grunt is running. Once grunt's tasks have completed, the web server stops. This behavior can be changed with the [keepalive](#keepalive) option, and can be enabled ad-hoc by running the task like `grunt connect:keepalive`.

This task was designed to be used in conjunction with another task that is run immediately afterwards, like the [qunit task](https://github.com/gruntjs/grunt-contrib-qunit).

### Options

#### port
Type: `Integer`  
Default: `8000`

The port on which the webserver will respond.

#### hostname
Type: `String`  
Default: `localhost`

The hostname the webserver will use.

#### base
Type: `String`  
Default: `.`

The base (or root) directory from which files will be served. The default directory is the same directory as the project's gruntfile.

#### keepalive
Type: `Boolean`  
Default: `false`

Keep the server alive indefinitely. Note that if this option is enabled, any tasks specified after this task will _never run_. By default, once grunt's tasks have completed, the web server stops.

This option can be enabled ad-hoc by running the task like `grunt connect:keepalive`

#### middleware
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

### Usage examples

#### Basic Use
In this example, `grunt connect` will start a static web server at `http://localhost:9001/`, with its base path set to the `www-root` directory relative to the gruntfile, and any tasks run afterwards will be able to access it.

```javascript
// Project configuration.
grunt.initConfig({
  connect: {
    port: 9001,
    base: 'www-root'
  }
});
```

#### Roll Your Own
Like the previous example, this example will start a static web server at `http://localhost:9001/`, with its base path set to the `www-root` directory relative to the gruntfile. Unlike the previous example, this is done by creating a brand new task. in fact, this plugin isn't even installed!

```javascript
// Project configuration.
grunt.initConfig({ /* Nothing needed here! */ });

// After running "npm install connect --save-dev" to add connect as a dev
// dependency of your project, you can require it in your gruntfile with:
var connect = require('connect');

// Now you can define a "connect" task that starts a webserver, using the
// connect lib, with whatever options and configuration you need:
grunt.registerTask('connect', 'Start a custom static web server.', function() {
  grunt.log.writeln('Starting static web server in "www-root" on port 9001.');
  connect(connect.static('www-root')).listen(9001);
});
```


## Release History

 * 2012-10-31   v0.1.0   Work in progress, not yet officially released.

---

Task submitted by ["Cowboy" Ben Alman](http://benalman.com)

*This file was generated on Thu Nov 01 2012 12:23:55.*
