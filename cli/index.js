var through = require('through2')

var cli = module.exports = through.obj()

var pipes = [
  './config/defaults',
  './config/config',
  './config/whitelist-commands',
  './commands/version',
  './doc/help',
  './metadata/files',
  './metadata/content-types',
  './metadata/git',
  './metadata/stats',
  './commands/url',
  './commands/upload',
  './commands/register',
  './commands/serve'
]

pipes.reduce(function (prev, path) {
  var factory = require(path)
  var stream = prev.pipe(factory(prev))
  stream.on('error', function (err) {
    cli.emit('error', err)
  })
  return stream
}, cli)
