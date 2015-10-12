# Usage examples

## Basic Use
In this example, `grunt connect` (or more verbosely, `grunt connect:server`) will start a static web server at `http://localhost:9001/`, with its base path set to the `www-root` directory relative to the gruntfile, and any tasks run afterwards will be able to access it.

```javascript
// Project configuration.
grunt.initConfig({
  connect: {
    server: {
      options: {
        port: 9001,
        base: 'www-root'
      }
    }
  }
});
```

If you want your web server to use the default options, just omit the `options` object. You still need to specify a target (`uses_defaults` in this example), but the target's configuration object can otherwise be empty or nonexistent. In this example, `grunt connect` (or more verbosely, `grunt connect:uses_defaults`) will start a static web server using the default options.

```javascript
// Project configuration.
grunt.initConfig({
  connect: {
    uses_defaults: {}
  }
});
```

## Multiple Servers
You can specify multiple servers to be run alone or simultaneously by creating a target for each server. In this example, running either `grunt connect:site1` or `grunt connect:site2` will  start the appropriate web server, but running `grunt connect` will run _both_. Note that any server for which the [keepalive](#keepalive) option is specified will prevent _any_ task or target from running after it.

```javascript
// Project configuration.
grunt.initConfig({
  connect: {
    site1: {
      options: {
        port: 9000,
        base: 'www-roots/site1'
      }
    },
    site2: {
      options: {
        port: 9001,
        base: 'www-roots/site2'
      }
    }
  }
});
```

## Static Options

Options for the serve-static module. See [serve-static](https://www.npmjs.com/package/serve-static):

```js
grunt.initConfig({
  connect: {
    server: {
      options: {
        port: 8000,
        base: {
          path: 'www-root',
          options: {
            index: 'somedoc.html',
            maxAge: 300000
          }
        }
      }
    }
  }
});
```



## 

## Roll Your Own
Like the [Basic Use](#basic-use) example, this example will start a static web server at `http://localhost:9001/`, with its base path set to the `www-root` directory relative to the gruntfile. Unlike the other example, this is done by creating a brand new task. in fact, this plugin isn't even installed!

```javascript
// Project configuration.
grunt.initConfig({ /* Nothing needed here! */ });

// After running "npm install connect serve-static --save-dev" to add connect as a dev
// dependency of your project, you can require it in your gruntfile with:
var connect = require('connect');
var serveStatic = require('serve-static');
connect(serveStatic('www-root')).listen(9001);

// Now you can define a "connect" task that starts a webserver, using the
// connect lib, with whatever options and configuration you need:
grunt.registerTask('connect', 'Start a custom static web server.', function() {
  grunt.log.writeln('Starting static web server in "www-root" on port 9001.');
  connect(serveStatic('www-root')).listen(9001);
});
```

## Support for HTTPS

A default certificate authority, certificate and key file are provided and pre-
configured for use when `protocol` has been set to `https`.

NOTE: No passphrase set for the certificate.
If you are getting warnings in Google Chrome, add 'server.crt' (from 'node_modules/tasks/certs')
to your keychain.
In OS X, after you add 'server.crt', right click on the certificate,
select 'Get Info' - 'Trust' - 'Always Trust', close window, restart Chrome.

For HTTPS livereload with [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch) 
 see the last example [here](https://github.com/gruntjs/grunt-contrib-watch#optionslivereload).

#### Advanced HTTPS config

If the default certificate setup is unsuitable for your environment, OpenSSL
can be used to create a set of self-signed certificates with a local ca root.

```shell
# Create ca.key, use a password phrase when asked
# When asked 'Common Name (e.g. server FQDN or YOUR name) []:' use your hostname, i.e 'mysite.dev'
openssl genrsa -des3 -out ca.key 1024
openssl req -new -key ca.key -out ca.csr
openssl x509 -req -days 365 -in ca.csr -out ca.crt -signkey ca.key

# Create server certificate
openssl genrsa -des3 -out server.key 1024
openssl req -new -key server.key -out server.csr

# Remove password from the certificate
cp server.key server.key.org
openssl rsa -in server.key.org -out server.key

# Generate self-siged certificate
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

For more details on the various options that can be set when configuring SSL,
please see the Node documentation for [TLS][].

Grunt configuration would become

```javascript
// Project configuration.
grunt.initConfig({
  connect: {
    server: {
      options: {
        protocol: 'https',
        port: 8443,
        key: grunt.file.read('server.key').toString(),
        cert: grunt.file.read('server.crt').toString(),
        ca: grunt.file.read('ca.crt').toString()
      },
    },
  },
});
```

[TLS]: http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener

## Grunt Events
The connect plugin will emit a grunt event, `connect.{taskName}.listening`, once the server has started. You can listen for this event to run things against a keepalive server, for example:

```javascript
grunt.registerTask('jasmine-server', 'start web server for jasmine tests in browser', function() {
  grunt.task.run('jasmine:tests:build');

  grunt.event.once('connect.tests.listening', function(host, port) {
    var specRunnerUrl = 'http://' + host + ':' + port + '/_SpecRunner.html';
    grunt.log.writeln('Jasmine specs available at: ' + specRunnerUrl);
    require('open')(specRunnerUrl);
  });

  grunt.task.run('connect:tests:keepalive');
});
```
