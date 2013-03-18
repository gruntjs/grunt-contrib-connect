'use strict';

var grunt = require('grunt');
var http = require('http');

function get(url, done) {
  http.get(url, function(res) {
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
  custom_middleware: function(test) {
    test.expect(4);
    get('http://localhost:9002/fixtures/hello.txt', function(res, body) {
      test.equal(res.statusCode, 200, 'should return 200');
      test.equal(body, 'Hello world', 'should return static page');
      get('http://localhost:9002/custom', function(res, body) {
        test.equal(res.statusCode, 200, 'should return 200');
        test.equal(body, 'Hello from port 9002', 'should return static page');
        test.done();
      });
    });
  },

};
