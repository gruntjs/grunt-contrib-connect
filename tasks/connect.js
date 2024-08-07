/*
 * grunt-contrib-connect
 * https://gruntjs.com/
 *
 * Copyright (c) 2016 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var path = require('path');
  var connect = require('connect');
  var morgan = require('morgan');
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var http = require('http');
  var https = require('https');
  var http2 = require('http2-wrapper');
  var injectLiveReload = require('connect-livereload');
  var open = require('open');
  var portscanner = require('portscanner');
  var async = require('async');

  var MAX_PORTS = 30; // Maximum available ports to check after the specified port

  var createDefaultMiddleware = function createDefaultMiddleware(connect, options) {
    var middlewares = [];
    if (!Array.isArray(options.base)) {
      options.base = [options.base];
    }
    // Options for serve-static module. See https://www.npmjs.com/package/serve-static
    var defaultStaticOptions = {};
    var directory = options.directory || options.base[options.base.length - 1];
    options.base.forEach(function(base) {
      // Serve static files.
      var path = base.path || base;
      var staticOptions = base.options || defaultStaticOptions;
      middlewares.push(serveStatic(path, staticOptions));
    });
    // Make directory browse-able.
    middlewares.push(serveIndex(directory.path || directory, directory.options));
    return middlewares;
  };

  grunt.registerMultiTask('connect', 'Start a connect web server.', function() {
    var done = this.async();
    // Merge task-specific options with these defaults.
    var options = this.options({
      protocol: 'http',
      port: 8000,
      hostname: '0.0.0.0',
      base: '.',
      directory: null,
      keepalive: false,
      debug: false,
      livereload: false,
      open: false,
      useAvailablePort: false,
      onCreateServer: null,
      // if nothing passed, then is set below 'middleware = createDefaultMiddleware.call(this, connect, options);'
      middleware: null
    });

    if (options.protocol !== 'http' && options.protocol !== 'https' && options.protocol !== 'http2') {
      grunt.fatal('protocol option must be \'http\', \'https\' or \'http2\'');
    }

    // Connect requires the base path to be absolute.
    if (Array.isArray(options.base)) {
      options.base = options.base.map(function(base) {
        if (base.path) {
          base.path = path.resolve(base.path);
          return base;
        }
        return path.resolve(base);
      });
    } else {
      if (options.base.path) {
        options.base.path = path.resolve(options.base.path);
      } else {
        options.base = path.resolve(options.base);
      }
    }

    // Backward compatibility: Support wildcard (see README).
    //
    // Support Node 18: "localhost" now expands to IPv6 "::" by default.
    // Listening for "0.0.0.0" is IPv4-only. In order to make sure grunt-contrib-connect usage
    // works as-is, both if you relied on "localhost" and if you relied on "127.0.0.1", bind the
    // listen to IPv6 "::" so that "localhost" keeps working. On most operating systems,
    // listening on "::" also results in receiving packets for 127.0.0.1.
    // Ref https://github.com/nodejs/node/issues/40702
    if (!options.hostname || options.hostname === '*' || options.hostname === '0.0.0.0') {
      options.hostname = '::';
    }

    // Connect will listen to ephemeral port if asked
    if (options.port === '?') {
      options.port = 0;
    }

    if (options.onCreateServer && !Array.isArray(options.onCreateServer)) {
      options.onCreateServer = [options.onCreateServer];
    }

    //  The middleware options may be null, an array of middleware objects,
    //  or a factory function that creates an array of middleware objects.
    //  * For a null value, use the default array of middleware
    //  * For a function, include the default array of middleware as the last arg
    //    which enables the function to patch the default middleware without needing to know
    //    the implementation of the default middleware factory function
    var middleware;
    if (options.middleware instanceof Array) {
      middleware = options.middleware;
    } else {
      middleware = createDefaultMiddleware.call(this, connect, options);

      if (typeof options.middleware === 'function') {
        middleware = options.middleware.call(this, connect, options, middleware);
      }
    }

    // If --debug was specified, enable logging.
    if (grunt.option('debug') || options.debug === true) {
      middleware.unshift(morgan('dev'));
    }

    // Start server.
    var taskTarget = this.target;
    var keepAlive = this.flags.keepalive || options.keepalive;

    async.waterfall([
      // find a port for livereload if needed first
      function(callback) {

        // Inject live reload snippet
        if (options.livereload !== false) {
          if (options.livereload === true) {
            options.livereload = {port: 35729, hostname: options.hostname};
          } else if (typeof options.livereload === 'number') {
            options.livereload = {port: options.livereload, hostname: options.hostname};
          }
          middleware.unshift(injectLiveReload(options.livereload));
          callback(null);
        } else {
          callback(null);
        }
      },
      function() {

        var app = connect();
        var server = null;
        var httpsOptions = {
          key: options.key || grunt.file.read(path.join(__dirname, 'certs', 'server.key')).toString(),
          cert: options.cert || grunt.file.read(path.join(__dirname, 'certs', 'server.crt')).toString(),
          ca: options.ca || grunt.file.read(path.join(__dirname, 'certs', 'ca.crt')).toString(),
          passphrase: options.passphrase || 'grunt',
          secureProtocol: options.secureProtocol || '',
        };

        middleware.forEach(function (m) {
          if (!Array.isArray(m)) {
            m = [m];
          }
          app.use.apply(app, m);
        });

        if (options.protocol === 'https') {
          server = https.createServer(httpsOptions, app);
        } else if (options.protocol === 'http2') {
          server = http2.createSecureServer(httpsOptions, app);
        } else {
          server = http.createServer(app);
        }

        // Call any onCreateServer functions that are present
        if (options.onCreateServer) {
          options.onCreateServer.forEach(function(func) {
            func.call(null, server, connect, options);
          });
        }

        function findUnusedPort(port, maxPort, hostname, callback) {
          if (hostname === '::') {
            hostname = '127.0.0.1';
          }

          if (port === 0) {
            async.nextTick(function() {
              callback(null, 0);
            });
          } else {
            portscanner.findAPortNotInUse(port, maxPort, hostname, callback);
          }
        }

        findUnusedPort(options.port, options.port + MAX_PORTS, options.hostname, function(error, foundPort) {
          if (error) {
            grunt.log.writeln('Failed to find unused port: ' + error);
          }

          // if the found port doesn't match the option port, and we are forced to use the option port
          if (options.port !== foundPort && options.useAvailablePort === false) {
            grunt.fatal('Port ' + options.port + ' is already in use by another process.');
          }

          server
            .listen(foundPort, options.hostname)
            .on('listening', function() {
              var port = foundPort;
              var scheme = options.protocol === 'http2' ? 'https' : options.protocol;
              var hostname = options.hostname;
              var targetHostname = hostname === '::' ? 'localhost' : hostname;
              var target = scheme + '://' + targetHostname + ':' + port;

              grunt.log.writeln('Started connect web server on ' + target);
              grunt.config.set('connect.' + taskTarget + '.options.hostname', hostname);
              grunt.config.set('connect.' + taskTarget + '.options.port', port);

              grunt.event.emit('connect.' + taskTarget + '.listening', hostname, port);

              if (options.open === true) {
                open(target);
              } else if (typeof options.open === 'object') {
                options.open.target = options.open.target || target;
                options.open.appName = options.open.appName || null;
                options.open.callback = options.open.callback || function() {};
                open(options.open.target, { app: options.open.appName })
                  .then(options.open.callback, grunt.fatal);
              } else if (typeof options.open === 'string') {
                open(options.open);
              }

              if (!keepAlive) {
                done();
              }
            })
            .on('error', function(err) {
              if (err.code === 'EADDRINUSE') {
                grunt.fatal('Port ' + foundPort + ' is already in use by another process.');
              } else {
                grunt.fatal(err);
              }
            });
        });

        // So many people expect this task to keep alive that I'm adding an option
        // for it. Running the task explicitly as grunt:keepalive will override any
        // value stored in the config. Have fun, people.
        if (keepAlive) {
          // This is now an async task. Since we don't call the "done"
          // function, this task will never, ever, ever terminate. Have fun!
          grunt.log.write('Waiting forever...\n');
        }
      }
    ]);
  });
};
