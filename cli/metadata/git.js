var exec = require('child_process').exec
var through = require('through2')
var async = require('async')

module.exports = function () {
  return through.obj(function (data, enc, done) {
    async.parallel({
      branch: getOutput('git rev-parse --abbrev-ref HEAD'),
      commit: getOutput('git rev-parse HEAD'),
      message: getOutput('git log -1 --pretty=%B'),
      user_name: getOutput('git config user.name'),
      user_email: getOutput('git config user.email')
    }, end)

    function end (err, result) {
      if (result.branch || result.commit || result.message) {
        data.git = result
      }
      done(err, data)
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
