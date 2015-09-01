var exec = require('child_process').exec
var through = require('through2')
var async = require('async')

module.exports = function () {
  return through.obj(function (packmule, enc, done) {
    async.parallel({
      branch: getOutput('git rev-parse --abbrev-ref HEAD'),
      commit: getOutput('git rev-parse HEAD'),
      committer: getOutput('git log -1 --pretty=format:"%an (%ae)"'),
      message: getOutput('git log -1 --pretty=%B')
    }, end)

    function end (err, result) {
      if (result.branch || result.commit || result.message) {
        packmule.metadata.git = result
      }
      done(err, packmule)
    }
  })
}

function getOutput (command) {
  return function (done) {
    exec(command, function (err, stdout, stderr) {
      if (err) {
        done(null, '')
      } else {
        done(null, stdout.toString().trim())
      }
    })
  }
}
