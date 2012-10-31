# grunt-contrib-connect [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-connect.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-connect)

> Start a static web server.

_Note that this plugin has not yet been released, and only works with the latest bleeding-edge, in-development version of grunt. See the [When will I be able to use in-development feature 'X'?](https://github.com/gruntjs/grunt/blob/devel/docs/faq.md#when-will-i-be-able-to-use-in-development-feature-x) FAQ entry for more information._

## Getting Started
_If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide._

From the same directory as your project's [Gruntfile][Getting Started] and [package.json][], install this plugin with the following command:

```bash
npm install grunt-contrib-connect --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-contrib-connect');
```

If the plugin has been installed correctly, running `grunt --help` at the command line should list the newly-installed plugin's task or tasks. In addition, the plugin should be listed in package.json as a `devDependency`, which ensures that it will be installed whenever the `npm install` command is run.

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
[package.json]: https://npmjs.org/doc/json.html


## The connect task

[Grunt homepage](http://gruntjs.com/) | [Documentation table of contents](toc.md)

### connect (built-in task)
Start a static web server.

#### About

This task starts a static web server on a specified port, at a specified path, which runs as long as grunt is running. Once grunt's tasks have completed, the web server stops.

_Need some help getting started with grunt? Visit the [getting started](getting_started.md) page. And if you're creating your own tasks, be sure to check out the [types of tasks](types_of_tasks.md) page as well as the [API documentation](api.md)._

#### A Very Important Note
Your Gruntfile **must** contain this code, once and **only** once. If it doesn't, grunt won't work. For the sake of brevity, this "wrapper" code has been omitted from all examples on this page, but it needs to be there.

```javascript
module.exports = function(grunt) {
  // Your grunt code goes in here.
};
```

#### Project configuration

This example shows a brief overview of the [config](api_config.md) properties used by the `server` task. For a more in-depth explanation, see the usage examples.

```javascript
// Project configuration.
grunt.initConfig({
  // Configuration options.
  connect: {}
});
```
### Options

#### port

Type: `Integer`
Default: `8000`

#### hostname

Type: `String`
Default: `localhost`

#### base

Type: `String`
Default: `.`

Base directory.

#### keepalive

Type: `Boolean`
Default: `false`

Keep the server alive after the task has finished.

#### middleware

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

#### Usage examples

##### Basic Use

In this example, `grunt connect` will start a static web server at `http://localhost:8000/`, with its base path set to the Gruntfile's directory. Of course, it will then immediately stop serving files, because grunt exits automatically when there are no more tasks to run.

The `connect` task is most useful when used in conjunction with another task, like the [qunit](task_qunit.md) task.

```javascript
// Project configuration.
grunt.initConfig({
  connect: {
    port: 8000,
    base: '.'
  }
});
```

##### Roll Your Own

Unlike the previous example, in this example the `grunt connect` command will run a completely custom `connect` task, because it has been overridden. This version is hard-coded to start a static web server at `http://localhost:1234/`, with its base path set to `www-root` subdirectory.

Like the previous example, it will then immediately stop serving files, because grunt exits automatically when there are no more tasks to run, but you'll undoubtedly be running additional tasks after this one.

```javascript
// Project configuration.
grunt.initConfig({
  // This custom server task doesn't care about config options!
});

// Of course, you need to have the "connect" Npm module installed locally
// for this to work. But that's just a matter of running: npm install connect
var connect = require('connect');

// Redefining the "connect" task for this project. Note that the output
// displayed by --help will reflect the new task description.
grunt.registerTask('connect', 'Start a custom static web server.', function() {
  grunt.log.writeln('Starting static web server in "www-root" on port 1234.');
  connect(connect.static('www-root')).listen(1234);
});
```

See the [connect task source](../tasks/connect.js) for more information.


## Release History

_(Nothing yet)_


--
Task submitted by <a href="http://benalman.com">"Cowboy" Ben Alman</a>.

*Generated on Wed Oct 31 2012 22:01:31.*
