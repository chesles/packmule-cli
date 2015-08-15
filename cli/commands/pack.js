var through = require('through2')
var fs = require('fs')

var PACK_PATTERN = /PACKMULE_RELEASE/

function needs_packed (data) {
  return PACK_PATTERN.test(data)
}

function pack (data, packmule) {
  return data.replace(PACK_PATTERN, packmule.release_url)
}

module.exports = function () {
  return through.obj(function (packmule, enc, done) {
    if (packmule.command === 'pack') {
      packmule.files.forEach(function (file) {
        var original = fs.readFileSync(file.path, 'utf8')
        if (needs_packed(original)) {
          var updated = pack(original, packmule)
          fs.writeFileSync(file.path, updated, 'utf8')
        }
      })
    }
    return done(null, packmule)
  })
}

module.exports.needs_packed = needs_packed
module.exports.pack = pack
