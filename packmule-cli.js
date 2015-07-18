#!/usr/bin/env node

var packmule = require('./cli')

var cli = packmule(process.argv)

cli.on('error', function (err) {
  console.warn('Error:', err.message)
  process.exit(1)
})
