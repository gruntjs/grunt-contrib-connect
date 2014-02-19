/*
 * grunt-contrib-connect
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';
var path = require('path');
var certs = path.join(__dirname, 'tasks', 'certs');

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    nodeunit: {
      tests: ['test/*_test.js']
    },

    connect: {
      custom_base: {
        options: {
          base: 'test',
        },
      },
      custom_port: {
        options: {
          base: 'test',
          port: 8001,
        },
      },
      custom_https: {
        options: {
          base: 'test',
          port: 8002,
          protocol: 'https',
        }
      },
      custom_https_certs: {
        options: {
          base: 'test',
          port: 8003,
          protocol: 'https',
          key: grunt.file.read(path.join(certs, 'server.key')).toString(),
          cert: grunt.file.read(path.join(certs, 'server.crt')).toString(),
          ca: grunt.file.read(path.join(certs, 'ca.crt')).toString(),
          passphrase: '',
        }
      },
      multiple_base: {
        options: {
          base: ['test', 'docs'],
          port: 8004,
        },
      },
      multiple_base_directory: {
        options: {
          base: ['test', 'docs'],
          directory: 'test/fixtures/',
          port: 8005,
        },
      },
      livereload: {
        options: {
          livereload: true,
          base: 'test/fixtures/',
          port: 8006,
        },
      },
      custom_middleware: {
        options: {
          port: 8007,
          base: 'test',
          middleware: function(connect, options, middlwares) {
            // an explicit array of any middlewares that ignores the default set
            return [
              connect.static(options.base[0]),

              function(req, res, next) {
                if (req.url !== '/hello/world') {
                  next();
                  return;
                }
                res.end('Hello from port ' + options.port);
              }
            ];
          },
        },
      },
      null_middleware: {
        options: {
          port: 8008,
          base: 'test/',
          middleware: null
        },
      },
      empty_middleware: {
        options: {
          port: 8009,
          base: 'test/',
          middleware: []
        },
      },
      custom_middleware_patch_default_middleware: {
        options: {
          port: 8010,
          base: 'test/',
          middleware: function(connect, options, middlewares) {
            // inject a custom middleware into the array of default middlewares
            // this is likely the easiest way for other grunt plugins to
            // extend the behavior of grunt-contrib-connect
            middlewares.push(function(req, res, next) {
              if (req.url !== '/hello/world') {
                return next();
              }

              res.end('Hello, world from port #' + options.port + '!');
            });

            return middlewares;
          },
        },
      },
      useAvailablePort: {
        options: {
          port: 9005,
          useAvailablePort: true,
          livereload: true
        }
      }
    },
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-internal');

  grunt.registerTask('test', ['connect', 'nodeunit']);
  grunt.registerTask('default', ['jshint', 'test', 'build-contrib']);
};
