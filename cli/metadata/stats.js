var through = require('through2')
var async = require('async')
var bytes = require('pretty-bytes')
var fs = require('fs')

module.exports = function () {
  return through.obj(function (packmule, enc, done) {
    var stats = packmule.metadata.stats = {
      files: 0,
      directories: 0,
      size: 0
    }

    async.forEach(packmule.files, function (file, done) {
      fs.lstat(file.path, function (err, stat) {
        if (err) {
          return done(err)
        }
        file.stat = stat

        if (!stat.isDirectory()) {
          stats.files += 1
          stats.size += stat.size
        } else {
          stats.directories += 1
        }
        done()
      })
    }, function (err) {
      stats.humanSize = bytes(stats.size)
      done(err, err ? null : packmule)
    })
  })
}
