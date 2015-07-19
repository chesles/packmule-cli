#!/usr/bin/env node

var packmule = module.exports = require('./cli')

if (process.mainModule === module) {
  var cli = packmule(process.argv.splice(2))

  cli.on('error', function (err) {
    console.warn('Error:', err.message)
    process.exit(1)
  })
}
