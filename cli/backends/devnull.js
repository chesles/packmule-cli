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

  upload: function (files, config, options, callbacks) {
    files.forEach(function (file) {
      if (file.stat.isFile()) {
        callbacks.progress(file.stat.size)
      }
    })
    callbacks.done()
  }
}
