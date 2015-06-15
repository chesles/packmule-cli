var test = require('tape')
var through = require('through2')
var config = require('../../cli/config/config')

test('no configuration files', function (t) {
  t.test('no custom options', function (t) {
    var stream = config()
    stream.pipe(
      through.obj(function (data, enc, done) {
        t.ok(data.config, 'should define a config object')
        t.deepEqual(Object.keys(data.config), ['key1', 'key2'], 'should not add any config keys that have no default')
        t.ok(data.options, 'should define an options object')
        t.deepEqual(Object.keys(data.options), ['option1', 'option2'], 'should not add any option keys that have no default')
        t.equal(data.command, 'foo', 'should keep the default command')
        t.end()
      })
    )

    stream.end({
      defaults: {
        config: {
          key1: 'value1',
          key2: 'value2'
        },
        options: {
          option1: 'option 1 value',
          option2: 'option 2 value'
        },
        command: 'foo'
      },
      args: {},
      argv: []
    })
  })

  t.test('custom configuration', function (t) {
    var stream = config()
    stream.pipe(
      through.obj(function (data, enc, done) {
        t.ok(data.config, 'should define a config object')
        t.deepEqual(data.config.channels, ['a', 'b', 'c'], 'should concat all channel sources')
        t.strictEqual(data.config.port, 1234, 'should convert string number to an integer')
        t.equal(data.config.some_setting, 'default value', 'should leave default config values alone if not specified')

        t.equal(data.options.verbose, false, 'should leave default options alone if not specified')
        t.equal(data.options.force, true, 'should override default options if specified')
        t.equal(data.options['skip-upload'], true, 'should override default options if specified')
        t.end()
      })
    )

    stream.end({
      defaults: {
        config: {
          channels: [],
          port: 9000,
          some_setting: 'default value'
        },
        options: {
          verbose: false,
          force: false,
          'skip-upload': false
        },
        command: 'default_command'
      },
      args: {
        port: '1234',
        channel: ['a', 'b'],
        c: 'c',
        force: true,
        'skip-upload': true
      },
      argv: ['my_command', 'some_folder']
    })
  })

})
