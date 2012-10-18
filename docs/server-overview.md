[Grunt homepage](http://gruntjs.com/) | [Documentation table of contents](toc.md)

# server (built-in task)
Start a static web server.

## About

This task starts a static web server on a specified port, at a specified path, which runs as long as grunt is running. Once grunt's tasks have completed, the web server stops.

_Need some help getting started with grunt? Visit the [getting started](getting_started.md) page. And if you're creating your own tasks, be sure to check out the [types of tasks](types_of_tasks.md) page as well as the [API documentation](api.md)._

## A Very Important Note
Your Gruntfile **must** contain this code, once and **only** once. If it doesn't, grunt won't work. For the sake of brevity, this "wrapper" code has been omitted from all examples on this page, but it needs to be there.

```javascript
module.exports = function(grunt) {
  // Your grunt code goes in here.
};
```

## Project configuration

This example shows a brief overview of the [config](api_config.md) properties used by the `server` task. For a more in-depth explanation, see the usage examples.

```javascript
// Project configuration.
grunt.initConfig({
  // Configuration options.
  server: {}
});
```