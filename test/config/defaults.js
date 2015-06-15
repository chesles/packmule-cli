var test = require('tape')
var through = require('through2')
var defaults = require('../../cli/config/defaults')

test('defaults', function (t) {
  var stream = defaults()
  stream.pipe(
    through.obj(function (data, enc, done) {
      t.ok(data.defaults, 'should add a defaults object')
      t.ok(data.argv, 'should copy argv')
      t.ok(data.args, 'should copy options')
      t.ok(data.defaults.config, 'should create a default config')
      t.ok(data.defaults.options, 'should create default options')
      t.ok(data.defaults.command, 'should set a default command')
      t.end()
    })
  )

  stream.end({ _: [] })
})
