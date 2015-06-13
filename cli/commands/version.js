var through = require('through2')

module.exports = function () {
  return through.obj(function (packmule, enc, done) {
    if (packmule.command === 'version') {
      var pkg = require('../../package.json')
      console.log('%s version %s', pkg.name, pkg.version)
      return done()
    }
    done(null, packmule)
  })
}
