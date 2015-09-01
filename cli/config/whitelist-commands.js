var through = require('through2')

var commands = [
  'help',
  'info',
  'register',
  'release',
  'serve',
  'upload',
  'url',
  'version'
]

module.exports = function () {
  return through.obj(function (packmule, enc, done) {
    if (commands.indexOf(packmule.command) < 0) {
      return done(new Error('Unknown command: ' + packmule.command))
    }
    done(null, packmule)
  })
}
module.exports.commands = commands
