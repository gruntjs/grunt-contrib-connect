## Usage examples

### Basic Use

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

### Roll Your Own

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