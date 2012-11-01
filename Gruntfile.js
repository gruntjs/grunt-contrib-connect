/*
 * grunt-contrib-connect
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    nodeunit: {
      tasks: ['test/*_test.js']
    },

    connect: {
      // Example usage
      port: 9001,
      middleware: function(connect, options) {
        // Return array of whatever middlewares you want
        return [
          function(req, res, next) {
            res.end('Hello world');
          }
        ];
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-internal');

  grunt.registerTask('test', ['connect', 'nodeunit']);
  grunt.registerTask('default', ['test', 'build-contrib']);
};
