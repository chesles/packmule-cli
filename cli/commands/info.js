var through = require('through2')

module.exports = function () {
  return through.obj(function (packmule, enc, done) {
    if (packmule.command === 'info') {
      var data = packmule.metadata

      Object.keys(output).forEach(function (key, i) {
        if (data[key]) {
          if (i > 0) console.log('')
        }
        output[key](data[key])
      })
    }
    done(null, packmule)
  })
}

var output = {
  git: function (data) {
    console.log('===== GIT =====')
    console.log('Branch: %s\nCommit: %s\nCommitter: %s\nMessage: %s', data.branch, data.commit, data.committer, data.message)
  },

  types: function (data) {
    console.log('===== FILE TYPES =====')
    console.log('Fonts: %s', data.fonts)
    console.log('HTML: %s', data.html)
    console.log('Images: %s', data.images)
    console.log('Javascript: %s', data.js)
    console.log('Stylesheets: %s', data.style)
    console.log('Text: %s', data.text)
    console.log('Other: %s', data.other)
  },

  stats: function (data) {
    console.log('===== FILES =====')
    console.log('Files: %s files, %s directories', data.files, data.directories)
    console.log('Size: %s (%s)', data.size, data.humanSize)
  }

}
