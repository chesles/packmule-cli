var through = require('through2')
var defaults = require('lodash.defaults')
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

    var config = packmule.config = defaults(
      {},
      pick(packmule.args, Object.keys(packmule.defaults.config)),
      pkg_json,
      packmule_json,
      packmule.defaults.config
    )

    packmule.options = defaults(
      {},
      pick(packmule.args, Object.keys(packmule.defaults.options)),
      packmule.defaults.options
    )

    if ('channels' in packmule.defaults.config) {
      config.channels = [].concat(packmule.args.channel || []).concat(packmule.args.c || [])
    }
    if (config.port && typeof config.port !== 'number') {
      config.port = Number(config.port)
    }

    // get the first non-option argument,
    // else check for '--version',
    // default to 'release'
    packmule.command = packmule.argv && packmule.argv.length
      ? packmule.argv[0]
      : packmule.args.version ? 'version' : packmule.defaults.command

    // process command-specific option defaults
    Object.keys(config).forEach(function (key) {
      if (typeof config[key] === 'function') {
        config[key] = config[key](packmule.command)
      }
    })

    if (packmule.argv.length > 1) {
      packmule.config.source = packmule.argv[1]
    }

    done(null, packmule)
  })
}
