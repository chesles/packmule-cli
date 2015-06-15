var async = require('async')
var aws = require('aws-sdk')
var path = require('path')
var fs = require('fs')

module.exports = {
  config: function (packmule) {
    return {
      bucket: packmule.opts.bucket,
      path: packmule.config.path.replace(/^\//, ''),
      release: packmule.config.release,
      source: packmule.config.source,
      files: packmule.files,
      s3: new aws.S3()
    }
  },

  check: function (config) {
    if (!config.bucket) {
      return { error: true, message: 'No bucket defined for S3 storage' }
    }

    return { error: false }
  },

  exists: function (config, done) {
    var listOpts = {
      Bucket: config.bucket,
      Prefix: [config.path, config.release].join('/'),
      MaxKeys: 1
    }

    config.s3.listObjects(listOpts, function (err, data) {
      if (err) {
        return done(err)
      } else if (data && data.Contents.length) {
        return done(null, true)
      } else {
        return done(null, false)
      }
    })
  },

  upload: function (config, options, callbacks) {
    async.each(config.files, function (file, done) {
      var base_path = path.relative(config.source, file.path)
      var bucket_path = [config.path, config.release, base_path].join('/')

      if (file.stat.isDirectory()) {
        return done()
      }
      if (file.stat.size === 0) {
        return done()
      }

      var params = {
        Bucket: config.bucket,
        Key: bucket_path,
        Body: fs.createReadStream(file.path),
        ContentType: 'text/plain',
        ACL: 'public-read'
      }
      if (file.ContentType) {
        params.ContentType = file.ContentType
      }
      if (file.ContentEncoding) {
        params.ContentEncoding = file.ContentEncoding
      }
      var upload = config.s3.upload(params)
      upload.on('httpUploadProgress', function (progress) {
        callbacks.progress(progress.loaded)
      })
      upload.send(done)
    }, function (err) {
      if (err) {
        console.warn('-> upload failed', err)
      }
      callbacks.done(err)
    })
  }
}
