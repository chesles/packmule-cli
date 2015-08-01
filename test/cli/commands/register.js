var test = require('tape')
var sinon = require('sinon')
var through = require('through2')
var request = require('request')
var register = require('../../../cli/commands/register')

test('register', function (t) {
  var stream = register()

  var stub = sinon.stub(request, 'post', function (url, opts, cb) {
    t.equal(url, 'http://localhost/api/register-release', 'should POST to the configured endpoint')
    t.equal(opts.json.package, 'test-package', 'sends a package name')
    t.equal(opts.json.release, 'abcd123', 'sends a release id')
    t.deepEqual(opts.json.channels, ['test'], 'sends an array of channels')
    t.equal(opts.json.host, 'localhost', 'sends the release host')
    t.equal(opts.json.port, 1234, 'sends the release port')
    t.equal(opts.json.path, '/releases/test', 'sends the release path')
    t.equal(opts.json.metadata.stats.files, 17, 'sends file stats metadata')
    t.equal(opts.json.metadata.git.branch, 'test-branch', 'sends git metadata')
    t.equal(opts.headers['Authorization'], 'Token token=auth-token', 'sends an authorization header')
    stub.restore()
    cb()
  })

  stream.pipe(
    through.obj(function (data, enc, done) {
      t.end()
    })
  )

  stream.end({
    command: 'register',
    config: {
      token: 'auth-token',
      endpoint: 'http://localhost/api/register-release',
      package: 'test-package',
      release: 'abcd123',
      channels: ['test'],
      host: 'localhost',
      port: 1234,
      path: '/releases/test'
    },
    stats: {
      files: 17,
      directories: 5,
      size: 12300,
      humanSize: '12.3 kb'
    },
    git: {
      branch: 'test-branch',
      commit: 'commit-sha',
      message: 'commit-message',
      user_name: 'username',
      user_email: 'test@example.com'
    }
  })
})
