'use strict';

var grunt = require('grunt');
var http = require('http');
var https = require('https');

function get(url, done) {
  var client = http;
  if ((typeof url === 'string' && url.toLowerCase().indexOf('https') === 0) ||
    (typeof url === 'object' && url.port === 443) ||
    (typeof url === 'object' && url.scheme === 'https')) {
    client = https;
    delete url.scheme;
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
    get({
      hostname: 'localhost',
      port: 8000,
      path: '/fixtures/hello.txt',
      headers: {
        accept: 'text/plain',
      },
    }, function(res, body) {
      test.equal(res.statusCode, 200, 'should return 200');
      test.equal(body, 'Hello world', 'should return static page');
      test.done();
    });
  },
  custom_port: function(test) {
    test.expect(2);
    get({
      hostname: 'localhost',
      port: 8001,
      path: '/fixtures/hello.txt',
      headers: {
        accept: 'text/plain',
      },
    }, function(res, body) {
      test.equal(res.statusCode, 200, 'should return 200');
      test.equal(body, 'Hello world', 'should return static page');
      test.done();
    });
  },
  custom_https: function(test) {
    test.expect(2);
    get({
      scheme: 'https',
      /* per http://nodejs.org/api/https.html#https_https_request_options_callback
         allow certs signed by an untrusted CA */
      rejectUnauthorized: false,
      hostname: 'localhost',
      port: 8002,
      path: '/fixtures/hello.txt',
      headers: {
        accept: 'text/plain',
      },
    }, function(res, body) {
      test.equal(res.statusCode, 200, 'should return 200');
      test.equal(body, 'Hello world', 'should return static page');
      test.done();
    });
  },
  custom_https_certs: function(test) {
    test.expect(2);
    get({
      scheme: 'https',
      rejectUnauthorized: false,
      hostname: 'localhost',
      port: 8003,
      path: '/fixtures/hello.txt',
      headers: {
        accept: 'text/plain',
      },
    }, function(res, body) {
      test.equal(res.statusCode, 200, 'should return 200');
      test.equal(body, 'Hello world', 'should return static page');
      test.done();
    });
  },
  multiple_base: function(test) {
    test.expect(2);
    get({
      hostname: 'localhost',
      port: 8004,
      path: '/fixtures/hello.txt',
      headers: {
        accept: 'text/plain',
      },
    }, function(res, body) {
      test.equal(res.statusCode, 200, 'should return 200');
      get('http://localhost:8004/connect-examples.md', function(res, body) {
        test.equal(res.statusCode, 200, 'should return 200');
        test.done();
      });
    });
  },
  multiple_base_directory: function(test) {
    test.expect(4);
    get({
      hostname: 'localhost',
      port: 8005,
      path: '/',
      headers: {
        accept: 'text/html',
      },
    }, function(res, body) {
      test.equal(res.statusCode, 200, 'should return 200');
      test.ok((body.indexOf('hello.txt') !== -1), 'Listing should contain hello.txt');
      get('http://localhost:8005/fixtures/hello.txt', function(res, body) {
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
      port: 8006,
      path: '/livereload.html',
      headers: {
        accept: 'text/html',
      },
    }, function(res, body) {
      test.ok((body.indexOf('35729/livereload.js') !== -1), 'Should contain livereload snippet.');
      test.done();
    });
  },
  custom_middleware: function(test) {
    var PORT = 8007;
    test.expect(4);
    get({
      hostname: 'localhost',
      port: PORT,
      path: '/hello/world',
      headers: {
        accept: 'text/plain',
      },
      middleware: []
    }, function(res, body) {
      test.equal(res.statusCode, 200, 'should return 200');
      test.equal(body, 'Hello from port ' + PORT, 'should return a dynamic response');
      get({
        hostname: 'localhost',
        port: PORT,
        path: '/fixtures/hello.txt',
        headers: {
          accept: 'text/plain',
        },
      }, function(res, body) {
        test.equal(res.statusCode, 200, 'should return 200');
        test.equal(body, 'Hello world', 'should return static page');
        test.done();
      });
    });
  },
  null_middleware_should_use_default_middleware: function(test) {
    test.expect(2);
    get({
      hostname: 'localhost',
      port: 8008,
      path: '/fixtures/hello.txt',
      headers: {
        accept: 'text/plain',
      },
    }, function(res, body) {
      test.equal(res.statusCode, 200, 'should return 200');
      test.equal(body, 'Hello world', 'should return static page');
      test.done();
    });
  },
  empty_middleware_should_404_everything: function(test) {
    test.expect(1);
    get({
      hostname: 'localhost',
      port: 8009,
      path: '/fixtures/hello.txt',
      headers: {
        accept: 'text/plain',
      },
    }, function(res, body) {
      test.equal(res.statusCode, 404, 'should return 404');
      test.done();
    });
  },
  custom_middleware_can_patch_default_middleware: function(test) {
    var PORT = 8010;
    test.expect(4);
    get({
      hostname: 'localhost',
      port: PORT,
      path: '/hello/world',
      headers: {
        accept: 'text/plain',
      },
      middleware: []
    }, function(res, body) {
      test.equal(res.statusCode, 200, 'should return 200');
      test.equal(body, 'Hello, world from port #' + PORT + '!', 'should return a dynamic response');

      get({
        hostname: 'localhost',
        port: PORT,
        path: '/fixtures/hello.txt',
        headers: {
          accept: 'text/plain',
        },
      }, function(res, body) {
        test.equal(res.statusCode, 200, 'should return 200');
        test.equal(body, 'Hello world', 'should return static page');
        test.done();
      });
    });
  },
};
