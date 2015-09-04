var through = require('through2')
var fs = require('fs')

var PACK_PATTERN = /PACKMULE_RELEASE/g

function needs_packed (data) {
  return PACK_PATTERN.test(data)
}

function pack (data, release_url) {
  return data.replace(PACK_PATTERN, release_url)
}

function getFilter (release_url) {
  return through(function (data, enc, done) {
    var str = data.toString('utf8')
    done(null, needs_packed(str) ? pack(str, release_url) : data)
  })
}

module.exports = function () {
  return through.obj(function (packmule, enc, done) {
    if (packmule.command === 'pack') {
      packmule.files.forEach(function (file) {
        var original = fs.readFileSync(file.path, 'utf8')
        if (needs_packed(original)) {
          var updated = pack(original, packmule.release_url)
          fs.writeFileSync(file.path, updated, 'utf8')
        }
      })
    }
    return done(null, packmule)
  })
}

module.exports.getFilter = getFilter
