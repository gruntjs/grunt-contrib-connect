'use strict';

var grunt = require('grunt');
var http = require('http');
var https = require('https');

function get(url, done) {
  var client = http;
  if ((typeof url === 'string' && url.toLowerCase().indexOf('https') === 0) ||
    (typeof url === 'object' && url.port === 443)) {
    client = https;
  }
  client.get(url, function(res) {
    var body = '';
    res.on('data', function(chunk) {
      body += chunk;
    }).on('end', function() {
      done(res, body);
    });
  });
}

exports.connect = {
  custom_base: function(test) {
    test.expect(2);
    get('http://localhost:8000/fixtures/hello.txt', function(res, body) {
      test.equal(res.statusCode, 200, 'should return 200');
      test.equal(body, 'Hello world', 'should return static page');
      test.done();
    });
  },
  multiple_base: function(test) {
    test.expect(2);
    get('http://localhost:9002/fixtures/hello.txt', function(res, body) {
      test.equal(res.statusCode, 200, 'should return 200');
      get('http://localhost:9002/connect-examples.md', function(res, body) {
        test.equal(res.statusCode, 200, 'should return 200');
        test.done();
      });
    });
  },
  multiple_base_directory: function(test) {
    test.expect(4);
    get('http://localhost:9003', function(res, body) {
      test.equal(res.statusCode, 200, 'should return 200');
      test.ok((body.indexOf('hello.txt') !== -1), 'Listing should contain hello.txt');
      get('http://localhost:9003/fixtures/hello.txt', function(res, body) {
        test.equal(res.statusCode, 200, 'should return 200');
        test.equal(body, 'Hello world', 'Should display contents of /fixtures/hello.txt');
        test.done();
      });
    });
  },
  livereload: function(test) {
    test.expect(1);
    get({
      hostname: 'localhost',
      port: 9004,
      path: '/livereload.html',
      headers: {
        accept: 'html',
      },
    }, function(res, body) {
      test.ok((body.indexOf('35729/livereload.js') !== -1), 'Should contain livereload snippet.');
      test.done();
    });
  },
};
