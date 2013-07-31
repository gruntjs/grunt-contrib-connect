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

  multiple_base: function(test) {
    test.expect(2);

    // synchronisation variables
    var test1 = false;
    var test2 = false;

    get('http://localhost:9002/fixtures/hello.txt', function(res, body) {
      test1 = true;
      test.equal(res.statusCode, 200, 'should return 200');
      if(test2){ test.done();}
    });
    get('http://localhost:9002/connect-examples.md', function(res, body) {
      test2 = true;
      test.equal(res.statusCode, 200, 'should return 200');
      if(test1){ test.done();}
    });
  }

};
