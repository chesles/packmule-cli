var through = require('through2')

module.exports = function () {
  return through.obj(function (packmule, enc, done) {
    packmule.metadata = {}
    done(null, packmule)
  })
}
