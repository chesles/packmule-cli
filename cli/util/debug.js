var through = require('through2')

module.exports = function () {
  return through.obj(function (data, enc, done) {
    if (data.options.verbose) {
      console.warn('-> debug:', data)
    }
    done(null, data)
  })
}
