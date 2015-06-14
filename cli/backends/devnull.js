module.exports = {
  config: function (packmule) {
    return { files: packmule.files }
  },

  check: function (config) {
    return { error: false }
  },

  exists: function (config, done) {
    done(null, false)
  },

  upload: function (config, options, callbacks) {
    config.files.forEach(function (file) {
      if (file.stat.isFile()) {
        callbacks.progress(file.stat.size)
      }
    })
    callbacks.done()
  }
}
