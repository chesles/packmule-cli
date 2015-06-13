var through = require('through2')

module.exports = function () {
  return through.obj(function (packmule, enc, done) {
    var commands = [
      'help',
      'register',
      'release',
      'serve',
      'upload',
      'url',
      'version'
    ]
    if (commands.indexOf(packmule.command) < 0) {
      return done(new Error('Unknown command: ' + packmule.command))
    }
    done(null, packmule)
  })
}
