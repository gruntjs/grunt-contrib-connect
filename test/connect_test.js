'use strict';

var grunt = require('grunt');
var http = require('http');
var https = require('https');

function get(url, done) {
  var client = http;
  if (url.toLowerCase().indexOf('https') === 0) {
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
      test.equal(body.trim(), 'hello.txt', 'Listing should contain hello.txt');
      get('http://localhost:9003/fixtures/hello.txt', function(res, body) {
        test.equal(res.statusCode, 200, 'should return 200');
        test.equal(body, 'Hello world', 'Should display contents of /fixtures/hello.txt');
        test.done();
      });
    });
  },
};
