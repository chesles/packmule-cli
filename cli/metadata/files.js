var through = require('through2')
var fsignore = require('fstream-ignore')

module.exports = function () {
  return through.obj(function (packmule, enc, done) {
    var files = fsignore({ path: packmule.config.source, ignoreFiles: ['.gitignore', '.packmuleignore'] })
    files.addIgnoreRules(['.git', '.gitignore'])

    packmule.files = []
    files.on('child', function (file) {
      packmule.files.push({ path: file.path })
    })
    files.on('error', function (err) {
      done(err)
    })
    files.on('end', function () {
      done(null, packmule)
    })
  })
}
