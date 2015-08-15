var through = require('through2')
var ProgressBar = require('progress')

function getStorage (config) {
  var storage_backend = null
  try {
    storage_backend = require('../backends/' + config.storage)
  } catch (e) {
  }
  return storage_backend
}

module.exports = function () {
  return through.obj(function (packmule, enc, done) {
    if (packmule.options['skip-upload']) {
      console.warn('-> Skipping upload')
      return end()
    }

    if (['release', 'upload'].indexOf(packmule.command) >= 0) {
      var storage = getStorage(packmule.config)
      if (!storage) return end(new Error('Storage backend not found: ' + packmule.config.storage))

      var storage_conf = storage.config(packmule)
      var check = storage.check(storage_conf)

      if (check.error) {
        return end(new Error(check.message || 'Storage configuration check failed'))
      }

      storage.exists(storage_conf, function (err, exists) {
        if (err) {
          return end(err)
        } else if (exists) {
          var message = 'Release ' + packmule.config.release + ' exists.'
          if (!packmule.options.force) {
            var error = new Error(message + ' Use --force to upload anyway')
            return end(error)
          } else {
            console.warn(message + ' Uploading anyway (--force).')
          }
        }
        console.log('-> Uploading %s: %d files, %d directories (%s) to %s',
          packmule.config.source,
          packmule.stats.files,
          packmule.stats.directories,
          packmule.stats.humanSize,
          packmule.config.storage
        )
        var progress = new ProgressBar('uploading [:bar] :percent :current', {
          total: packmule.stats.size
        })

        var callbacks = {
          progress: function (bytes) {
            progress.tick(bytes)
          },
          done: function (err) {
            end(err)
          }
        }
        storage.upload(packmule.files, storage_conf, {}, callbacks)
      })
    } else {
      end()
    }

    function end (err) {
      return done(err, err ? null : packmule)
    }
  })
}
