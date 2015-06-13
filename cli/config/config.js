var through = require('through2')
var assign = require('lodash.assign')
var pick = require('lodash.pick')
var findRoot = require('find-root')
var path = require('path')

function getConf (file) {
  var config
  var root = findRoot(process.cwd())
  var conf_file = path.join(root, file)
  try {
    config = require(conf_file).packmule || {}
  } catch (e) {
  }
  return config
}

module.exports = function () {
  return through.obj(function (packmule, enc, done) {
    var packmule_json = getConf('packmule.json')
    var pkg_json = getConf('package.json')

    packmule.config = assign(
      {},
      packmule.defaults.config,
      pkg_json,
      packmule_json,
      pick(packmule.opts, Object.keys(packmule.defaults.config))
    )

    packmule.options = assign(
      {},
      packmule.defaults.options,
      pick(packmule.opts, Object.keys(packmule.defaults.options))
    )

    var channels = [].concat(packmule.opts.channel || []).concat(packmule.opts.c || [])
    packmule.config.channels = channels
    packmule.config.port = Number(packmule.config.port || packmule.defaults.config.port)

    // get the first non-option argument,
    // else check for '--version',
    // default to 'release'
    packmule.command = packmule.argv && packmule.argv.length
      ? packmule.argv[0]
      : packmule.opts.version ? 'version' : packmule.defaults.command

    if (packmule.argv.length > 1) {
      packmule.config.source = packmule.argv[1]
    }

    done(null, packmule)
  })
}
