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
          port: 9000,
        },
      },
      custom_middleware_short: {
        options: {
          port: 9001,
          middleware: function(connect, options) {
            // Return array of whatever middlewares you want
            return [
              function(req, res, next) {
                res.end('Hello from port ' + options.port);
              }
            ];
          },
        },
      },

      custom_middleware_targeted: {
        options: {
          port: 9002,
          base: 'test',
          middleware: function(connect, options) {
            // Return array of whatever middlewares you want
            return [
                {
                    '/custom': function(req, res, next) {
                        res.end('Hello from port ' + options.port);
                    }
                },
                connect.static(path.resolve(options.base)),
                connect.directory(path.resolve(options.base)),
            ];
          },
        },
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-internal');

  grunt.registerTask('test', ['connect', 'nodeunit']);
  grunt.registerTask('default', ['jshint', 'test', 'build-contrib']);
};
