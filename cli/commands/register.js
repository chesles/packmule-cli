var through = require('through2')
var request = require('request')

module.exports = function () {
  return through.obj(function (packmule, enc, done) {
    if (['release', 'register'].indexOf(packmule.command) >= 0) {
      console.warn('-> Registering release %s at %s', packmule.config.release, packmule.config.endpoint)
      var endpoint = packmule.config.endpoint
      var payload = {
        package: packmule.config.package,
        release: packmule.config.release,
        channels: packmule.config.channels,
        host: packmule.config.host,
        port: packmule.config.port,
        path: packmule.config.path,
        metadata: {
          stats: packmule.stats,
          git: packmule.git
        }
      }
      var headers = { }
      if (packmule.config.token) {
        headers['Authorization'] = 'Token token=' + packmule.config.token
      }
      request.post(endpoint, { json: payload, headers: headers }, end)
    } else {
      end()
    }
    function end (err) {
      return done(err, err ? null : packmule)
    }
  })
}
