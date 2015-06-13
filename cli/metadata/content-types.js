var through = require('through2')

// set the content type for files that may or may not be gzipped
function getType (path) {

  if (/\.txt(\.gz)?$/.test(path)) {
    return 'text/plain'
  }
  if (/\.html(\.gz)?$/.test(path)) {
    return 'text/html'
  }
  if (/\.js(\.gz)?$/.test(path)) {
    return 'application/javascript'
  }
  if (/\.css(\.gz)?$/.test(path)) {
    return 'text/css'
  }
  if (/\.svg(\.gz)?$/.test(path)) {
    return 'image/svg+xml'
  }
  if (/\.svg(\.gz)?$/.test(path)) {
    return 'image/svg+xml'
  }

}

function getEncoding (path) {
  // gzipped files get Content-Encoding: gzip
  if (/\.gz$/.test(path)) {
    return 'gzip'
  }
}

module.exports = function () {
  return through.obj(function (packmule, enc, done) {
    packmule.files.forEach(function (file) {
      var type = getType(file.path)
      var encoding = getEncoding(file.path)
      if (type) {
        file.ContentType = type
      }
      if (encoding) {
        file.ContentEncoding = encoding
      }
    })
    done(null, packmule)
  })
}
