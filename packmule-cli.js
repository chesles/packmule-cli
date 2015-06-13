#!/usr/bin/env node

var argv = require('yargs')
  .options({
    verbose: { alias: 'v' },
    port: { alias: 'p' }
  })
  .boolean(['force', 'skip-upload', 'verbose', 'version'])
  .argv

var cli = require('./cli')

cli.on('error', function (err) {
  console.warn('Error:', err.message)
  process.exit(1)
})

cli.end(argv)
