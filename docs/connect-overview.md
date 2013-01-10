{%= s.multi_task %}

Note that this server only runs as long as grunt is running. Once grunt's tasks have completed, the web server stops. This behavior can be changed with the [keepalive](#keepalive) option, and can be enabled ad-hoc by running the task like `grunt connect:keepalive`.

This task was designed to be used in conjunction with another task that is run immediately afterwards, like the [grunt-contrib-qunit plugin](https://github.com/gruntjs/grunt-contrib-qunit) `qunit` task.

_This plugin is only compatible with Grunt >= 0.4.0. This plugin is the replacement for the Grunt v0.3 core task `server`._
