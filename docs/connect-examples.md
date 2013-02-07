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

## Roll Your Own
Like the [Basic Use](#basic-use) example, this example will start a static web server at `http://localhost:9001/`, with its base path set to the `www-root` directory relative to the gruntfile. Unlike the other example, this is done by creating a brand new task. in fact, this plugin isn't even installed!

```javascript
// Project configuration.
grunt.initConfig({ /* Nothing needed here! */ });

// After running "npm install connect --save-dev" to add connect as a dev
// dependency of your project, you can require it in your gruntfile with:
var connect = require('connect');

// Now you can define a "connect" task that starts a webserver, using the
// connect lib, with whatever options and configuration you need:
grunt.registerTask('connect', 'Start a custom static web server.', function() {
  grunt.log.writeln('Starting static web server in "www-root" on port 9001.');
  connect(connect.static('www-root')).listen(9001);
});
```

## Support for HTTPS

A default certificate authority, certificate and key file are provided and pre-
configured for use when `protocol` has been set to `https`.

NOTE: The passphrase used on the files is `grunt`

##### Advanced HTTPS config

If the default certificate setup is unsuitable for your environment, OpenSSL
can be used to create a set of self-signed certificates with a local ca root.

```shell
# Generate the CA key
# Set a passphrase and remember what it is
openssl genrsa -des3 -out ca.key 2048
# Generate a CA root
openssl req -new -x509 -days 3650 -key ca.key -out ca.crt

# Generate the server key
openssl genrsa -out server.key 1024
# Generate the request to the self-signed CA root
openssl req -new -key server.key -out server.csr
# Generate the server certificate
openssl x509 -req -in server.csr -out server.crt -CA ca.crt -CAkey ca.key -CAcreateserial -days 3650
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
        ca: grunt.file.read('ca.crt').toString(),
        passphrase: 'grunt',
      },
    },
  },
});
```

[TLS]: http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener
