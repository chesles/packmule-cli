var through = require('through2')

// set the content type for files that may or may not be gzipped
function getType (path, stats) {
  if (/\.txt(\.gz)?$/.test(path)) {
    stats.text++
    return 'text/plain'
  }
  /* markup, scripts, etc */
  if (/\.html(\.gz)?$/.test(path)) {
    stats.html++
    return 'text/html'
  }
  if (/\.js(\.gz)?$/.test(path)) {
    stats.js++
    return 'application/javascript'
  }
  if (/\.css(\.gz)?$/.test(path)) {
    stats.style++
    return 'text/css'
  }
  /* images */
  if (/\.svg(\.gz)?$/.test(path)) {
    stats.images++
    return 'image/svg+xml'
  }
  if (/\.jpg(\.gz)?$/.test(path)) {
    stats.images++
    return 'image/jpeg'
  }
  if (/\.png(\.gz)?$/.test(path)) {
    stats.images++
    return 'image/png'
  }
  if (/\.gif(\.gz)?$/.test(path)) {
    stats.images++
    return 'image/gif'
  }
  /* fonts */
  if (/\.woff(2)?$/.test(path)) {
    stats.fonts++
    return 'application/font-woff'
  }
  if (/\.otf(\.gz)?$/.test(path)) {
    stats.fonts++
    return 'application/x-font-opentype'
  }
  if (/\.eot(\.gz)?$/.test(path)) {
    stats.fonts++
    return 'application/vnd.ms-fontobject'
  }
  if (/\.ttf(\.gz)?$/.test(path)) {
    stats.fonts++
    return 'application/x-font-truetype'
  }
  stats.other++
  return null
}

function getEncoding (path) {
  if (/\.gz$/.test(path)) {
    return 'gzip'
  }
}

module.exports = function () {
  return through.obj(function (packmule, enc, done) {
    var types = {
      fonts: 0,
      html: 0,
      images: 0,
      js: 0,
      other: 0,
      style: 0,
      text: 0
    }

    packmule.metadata.types = types
    packmule.files.forEach(function (file) {
      var type = getType(file.path, types)
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
