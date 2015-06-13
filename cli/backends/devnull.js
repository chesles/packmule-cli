module.exports = {
  config: function (packmule) {
    return {}
  },

  check: function (config) {
    return { error: false }
  },

  exists: function (config, done) {
    done(null, false)
  },

  upload: function (config, options, done) {
    done(null)
  }
}
