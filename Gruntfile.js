/*
 * grunt-contrib-connect
 * http://gruntjs.com/
 *
 * Copyright (c) 2016 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';
var path = require('path');

var serveStatic = require('serve-static');
var certs = path.join(__dirname, 'tasks', 'certs');

module.exports = function(grunt) {

  grunt.option('stack', true);

  var testConnectInstances = {
    basic: {
      options: {
        port: 7999
      }
    },
    custom_base: {
      options: {
        base: 'test'
      }
    },
    custom_port: {
      options: {
        base: 'test',
        port: 8001
      }
    },
    self_port_q: {
      options: {
        base: 'test',
        port: '?'
      }
    },
    self_port_0: {
      options: {
        base: 'test',
        port: 0
      }
    },
    custom_https: {
      options: {
        base: 'test',
        port: 8002,
        protocol: 'https'
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
        passphrase: ''
      }
    },
    custom_base_with_options: {
      options: {
        base: {
          path: 'test',
          options: {
            index: 'fixtures/hello.txt'
          }
        },
        port: 8014
      }
    },
    multiple_base: {
      options: {
        base: ['test', 'docs'],
        port: 8004
      }
    },
    multiple_base_with_options: {
      options: {
        base: [
          {
            path: 'test',
            options: {
              index: 'fixtures/hello.txt'
            }
          },
          {
            path: 'docs',
            options: {
              maxAge: 300000 // 5min
            }
          }
        ],
        port: 8015
      }
    },
    multiple_base_directory: {
      options: {
        base: ['test', 'docs'],
        directory: 'test/fixtures/',
        port: 8005
      }
    },
    livereload: {
      options: {
        livereload: true,
        base: 'test/fixtures/',
        port: 8006
      }
    },
    custom_middleware: {
      options: {
        port: 8007,
        base: 'test',
        middleware: function(connect, options, middlwares) {
          // an explicit array of any middlewares that ignores the default set
          return [
            serveStatic(options.base[0]),

            function(req, res, next) {
              if (req.url !== '/hello/world') {
                next();
                return;
              }
              res.end('Hello from port ' + options.port);
            }
          ];
        }
      }
    },
    null_middleware: {
      options: {
        port: 8008,
        base: 'test/',
        middleware: null
      }
    },
    empty_middleware: {
      options: {
        port: 8009,
        base: 'test/',
        middleware: []
      }
    },
    custom_middleware_patch_default_middleware: {
      options: {
        port: 8010,
        base: 'test/',
        middleware: function(connect, options, middlewares) {
          // inject a custom middleware into the array of default middlewares
          // this is likely the easiest way for other grunt plugins to
          // extend the behavior of grunt-contrib-connect
          middlewares.unshift(function(req, res, next) {
            if (req.url !== '/hello/world') {
              return next();
            }

            res.end('Hello, world from port #' + options.port + '!');
          });

          return middlewares;
        }
      }
    },
    useAvailablePort: {
      options: {
        port: 8011,
        useAvailablePort: true,
        livereload: true
      }
    },
    allHostname: {
      options: {
        port: 8012,
        hostname: '*',
        base: 'test/'
      }
    },
    onCreateServer: {
      options: {
        port: 8013,
        hostname: '*',
        onCreateServer: function(server, connect, options) {
          server.on('request', function(req, res) {
            // set a config object, so we can check it in our tests
            grunt.config.data.connect.onCreateServer.test = true;
          });
        }
      }
    },
    routedMiddleware: {
      options: {
        port: 8016,
        hostname: '*',
        middleware: function(connect, options, middleware) {
          middleware.unshift(['/mung', function (req, res, next) {
            res.end('Yay');
          }]);
          return middleware;
        }
      }
    }
  };

  // don't try to test http2 support in node < 0.12, see https://github.com/molnarg/node-http2/issues/101
  if (!/^0.(?:1|2|3|4|5|6|7|8|9|10|11)\./.test(process.versions.node)) {
    testConnectInstances.http2 = {
      options: {
        base: 'test',
        port: 8017,
        protocol: 'http2',
      }
    };
  }

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

    connect: testConnectInstances
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-internal');

  grunt.registerTask('test', ['jshint', 'connect', 'nodeunit']);
  grunt.registerTask('default', ['test', 'build-contrib']);
};
