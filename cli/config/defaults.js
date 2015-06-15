var through = require('through2')

function unix_timestamp () {
  return Math.round(Date.now() / 1000).toString()
}

module.exports = function () {
  return through.obj(function (args, enc, done) {
    var config = {
      host: 'localhost',
      port: 6462,
      path: 'releases',
      package: '',
      release: unix_timestamp(),
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
