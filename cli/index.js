var through = require('through2')

var pipes = [
  './config/arg-parse',
  './config/defaults',
  './config/config',
  './config/whitelist-commands',
  './commands/version',
  './doc/help',
  './metadata',
  './metadata/files',
  './metadata/content-types',
  './metadata/git',
  './metadata/stats',
  './commands/info',
  './commands/url',
  './commands/pack',
  './commands/upload',
  './commands/register',
  './commands/serve'
]

function cli (options) {
  var cli = through.obj()

  pipes.reduce(function (prev, path) {
    var factory = require(path)
    var stream = prev.pipe(factory(prev))
    stream.on('error', function (err) {
      cli.emit('error', err)
    })
    return stream
  }, cli)

  cli.end(options)
  return cli
}

module.exports = cli
