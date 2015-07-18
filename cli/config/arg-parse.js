var yargs = require('yargs')
var through = require('through2')

module.exports = function () {
  return through.obj(function (argv, enc, done) {
    var args = yargs(argv).options({
      channel: { alias: 'c' },
      host: { alias: 'h' },
      port: { alias: 'p' },
      release: { alias: 'r' },
      verbose: { alias: 'v' }
    })
    .boolean(['force', 'skip-upload', 'verbose', 'version'])
    .argv

    // translate --help into 'help'
    if (args.help) {
      args._.push('help')
    }
    done(null, args)
  })
}
