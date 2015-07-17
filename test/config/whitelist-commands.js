var test = require('tape')
var through = require('through2')
var whitelist = require('../../cli/config/whitelist-commands')

test('whitelist', function (t) {
  t.test('known commands', function (t) {
    var stream = whitelist()
    var tests = through.obj(function (data, enc, done) {
      t.ok(true, 'should allow the "' + data.command + '" command')
      done(null, data)
    })
    stream.pipe(tests)
    stream.on('error', function () {
      t.ok(false, 'should not throw an error')
    })

    stream.write({ command: 'help' })
    stream.write({ command: 'register' })
    stream.write({ command: 'release' })
    stream.write({ command: 'serve' })
    stream.write({ command: 'upload' })
    stream.write({ command: 'url' })
    stream.end({ command: 'version' })

    t.plan(7)

    tests.on('end', t.end)
  })

  t.test('unknown commands', function (t) {
    var stream = whitelist()
    var tests = through.obj(function (data, enc, done) {
      t.ok(false, 'allowed the "' + data.command + '" command, but should not have')
      done(null, data)
    })
    stream.pipe(tests)
    stream.on('error', function (err) {
      console.warn(err)
      t.ok(true, 'should throw an error')
    })

    stream.write({ command: 'yelp' })
    stream.write({ command: 'foo' })
    stream.write({ command: 'bar' })
    stream.end({ command: 'asdfghjkl;' })

    t.plan(4)

    tests.on('end', t.end)
    t.end()
  })
})
