/*
 * grunt-contrib-connect
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var path = require('path');
  var connect = require('connect');
  var http = require('http');
  var https = require('https');

  grunt.registerMultiTask('connect', 'Start a connect web server.', function() {
    // Merge task-specific options with these defaults.
    var options = this.options({
      protocol: 'http',
      port: 8000,
      hostname: 'localhost',
      base: '.',
      keepalive: false,
      middleware: function(connect, options) {
        var middlewares = [];
        options.base.forEach(function(base) {
          // Serve static files.
          middlewares.push(connect.static(base));
          // Make empty directories browsable.
          middlewares.push(connect.directory(base));
        });
        return middlewares;
      }
    });

    if (options.protocol !== 'http' && options.protocol !== 'https') {
      grunt.fatal('protocol option must be \'http\' or \'https\'');
    }

    // Normalize whether base is an array
    options.base = Array.isArray(options.base) ? options.base : [options.base];

    // Connect requires the base path to be absolute.
    options.base = options.base.map(function(base) {
      return path.resolve(base);
    });

    // Connect will listen to all interfaces if hostname is null.
    if (options.hostname === '*') {
      options.hostname = null;
    }

    // Connect will listen to ephemeral port if asked
    if (options.port === '?') {
      options.port = 0;
    }

    var middleware = options.middleware ? options.middleware.call(this, connect, options) : [];

    // If --debug was specified, enable logging.
    if (grunt.option('debug')) {
      connect.logger.format('grunt', ('[D] server :method :url :status ' +
        ':res[content-length] - :response-time ms').magenta);
      middleware.unshift(connect.logger('grunt'));
    }

    // Start server.
    var done = this.async();
    var taskTarget = this.target;
    var keepAlive = this.flags.keepalive || options.keepalive;

    var app = connect.apply(null, middleware);
    var server = null;

    if (options.protocol === 'https') {
      server = https.createServer({
        key: options.key || grunt.file.read(path.join(__dirname, 'certs', 'server.key')).toString(),
        cert: options.cert || grunt.file.read(path.join(__dirname, 'certs', 'server.crt')).toString(),
        ca: options.ca || grunt.file.read(path.join(__dirname, 'certs', 'ca.crt')).toString(),
        passphrase: options.passphrase || 'grunt',
      }, app);
    } else {
      server = http.createServer(app);
    }

    server
      .listen(options.port, options.hostname)
      .on('listening', function() {
        var address = server.address();
        grunt.log.writeln('Started connect web server on ' + (address.address || 'localhost') + ':' + address.port + '.');
        grunt.config.set('connect.' + taskTarget + '.options.host', address.address || 'localhost');
        grunt.config.set('connect.' + taskTarget + '.options.port', address.port);

        grunt.event.emit('connect.' + taskTarget + '.listening', (address.host || 'localhost'), address.port);

        if (!keepAlive) {
          done();
        }
      })
      .on('error', function(err) {
        if (err.code === 'EADDRINUSE') {
          grunt.fatal('Port ' + options.port + ' is already in use by another process.');
        } else {
          grunt.fatal(err);
        }
      });

    // So many people expect this task to keep alive that I'm adding an option
    // for it. Running the task explicitly as grunt:keepalive will override any
    // value stored in the config. Have fun, people.
    if (keepAlive) {
      // This is now an async task. Since we don't call the "done"
      // function, this task will never, ever, ever terminate. Have fun!
      grunt.log.write('Waiting forever...\n');
    }
  });
};
