var through = require('through2')
var url = require('url')
var path = require('path')

module.exports = function () {
  return through.obj(function (data, enc, done) {
    data.release_url = url.format({
      hostname: data.config.host,
      port: [80, 443].indexOf(data.config.port) >= 0 ? null : data.config.port,
      pathname: path.normalize([data.config.path, data.config.release].join('/'))
    })
    if (data.command === 'url') {
      console.log(data.release_url)
    }
    return done(null, data)
  })
}
