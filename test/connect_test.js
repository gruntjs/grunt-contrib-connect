'use strict';

var grunt = require('grunt');
var http = require('http');

exports.connect = {
  request: function(test) {
    test.expect(2);

    http.get('http://localhost:9001', function(res) {
      var body = '';
      res.on('data', function(chunk) {
        body += chunk;
      }).on('end', function() {
        test.equal(res.statusCode, 200, 'should return 200');
        test.equal(body, 'Hello world', 'should return page with middleware modification');
        test.done();
      });
    });
  }
};
