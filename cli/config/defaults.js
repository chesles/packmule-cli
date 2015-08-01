var through = require('through2')

function unix_timestamp () {
  return Math.round(Date.now() / 1000).toString()
}

/*
 * most options have a simple default value we can set directly in the
 * defaults object. a few depend on which command is being called, and those
 * defaults are configured here
 */
function command_default (option, _default) {
  var command_defaults = {
    serve: {
      release: 'dev',
      host: 'localhost'
    },
    url: {
      port: null
    }
  }

  return function (command) {
    if (command in command_defaults) {
      return command_defaults[command][option] || _default
    }
    return _default
  }
}

module.exports = function () {
  return through.obj(function (args, enc, done) {
    var config = {
      host: command_default('host', 'localhost'),
      port: command_default('port', 6462),
      path: 'releases',
      package: '',
      release: command_default('release', unix_timestamp()),
      channels: [],
      storage: 's3',
      endpoint: '',
      source: process.cwd(),
      token: ''
    }
    var options = {
      force: false,
      'skip-upload': false,
      verbose: false
    }

    var argv = args._
    delete args._

    done(null, {
      defaults: {
        config: config,
        options: options,
        command: 'serve'
      },
      argv: argv,
      args: args
    })
  })
}
