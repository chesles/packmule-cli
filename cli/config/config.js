var through = require('through2')
var defaults = require('lodash.defaults')
var pick = require('lodash.pick')
var findRoot = require('find-root')
var path = require('path')
var whitelist = require('./whitelist-commands')

function get_conf (file) {
  var config
  var root = findRoot(process.cwd())
  var conf_file = path.join(root, file)
  try {
    config = require(conf_file) || {}
  } catch (e) {
  }
  return config
}

function convert_port (port) {
  return port && typeof port !== 'number'
    ? Number(port)
    : port
}

function get_channels (packmule) {
  return [].concat(packmule.args.channel || [])
}

function get_command (packmule) {
  var argc = packmule.argv.length
  var command = packmule.argv && argc > 0
    ? packmule.argv[0]
    : packmule.args.version ? 'version' : packmule.defaults.command

  // if only 1 arg and it's not a valid command, assume it's the source
  if (argc === 1 && whitelist.commands.indexOf(command) < 0) {
    command = packmule.defaults.command
  }

  return command
}

function get_source (packmule) {
  var argc = packmule.argv.length
  var default_source = packmule.defaults.config.source
  var source = argc > 0
    ? packmule.argv[argc - 1]
    : default_source

  // if only 1 arg and it is a valid command, assume source is cwd
  if (argc === 1 && whitelist.commands.indexOf(source) >= 0) {
    source = default_source
  }

  return source
}

function get_package (packmule) {
  return (packmule.config.package === '')
    ? path.basename(packmule.config.source)
    : packmule.config.package
}

function configure_command (packmule) {
  // process command-specific option defaults
  Object.keys(packmule.config).forEach(function (key) {
    var val = packmule.config[key]
    if (typeof val === 'function') {
      packmule.config[key] = val(packmule.command)
    }
  })
}

module.exports = function () {
  return through.obj(function (packmule, enc, done) {
    var packmule_json = get_conf('packmule.json')
    var pkg_json = get_conf('package.json')

    var config = packmule.config = defaults(
      {},
      pick(packmule.args, Object.keys(packmule.defaults.config)),
      pkg_json.packmule,
      packmule_json,
      packmule.defaults.config
    )
    config.package = config.package || pkg_json.name || ''

    packmule.options = defaults(
      {},
      pick(packmule.args, Object.keys(packmule.defaults.options)),
      packmule.defaults.options
    )

    if ('channels' in packmule.defaults.config) {
      config.channels = get_channels(packmule)
    }
    config.port = convert_port(config.port)
    packmule.command = get_command(packmule)
    configure_command(packmule)

    packmule.config.source = get_source(packmule)
    packmule.config.package = get_package(packmule)

    done(null, packmule)
  })
}
