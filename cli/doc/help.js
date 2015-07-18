var through = require('through2')

function help () {
/*
packmule - native web app release management tool

Usage:
    packmule [command] [directory] [options]

    with no command or directory, acts like `packmule serve .`

Commands:
    help            Show this message
    register        Register a release (without uploading any files)
    release         Upload and register a new release
    serve           Serve up a local release
    upload          Upload files for a release (without registering it)
    url             Print the URL a release will be at
    version         Show current version

General Options:
    -v, --verbose   Be chatty (default=false)
        --version   Show current version

Command Options:
  release, register
    -c, --channel   name(s) of channels to tag the release on (default=[])
        --endpoint  API endpoint to register releases
    -h, --host      host where releases can be found
        --path      path releases can be found at on the server (default=/releases/)
        --package   name of the package (default=package.json "name" field)
    -p, --port      port where releases can be found or to serve local releases on (default=6462)
    -r, --release   name of the release (default=current UNIX timestamp)
        --storage   backend storage to upload files to (default=s3)

  serve
    -h, --host      host to listen on (default=localhost)
    -p, --port      port to listen on (default=6462)
    -r, --release   name of the release to serve (default=dev)

  url

*/
  return help.toString().split(/\n/).slice(2, -3).join('\n')
}

module.exports = function () {
  return through.obj(function (packmule, enc, done) {
    if (packmule.command === 'help') {
      console.log(help())
      return done()
    }
    done(null, packmule)
  })
}
