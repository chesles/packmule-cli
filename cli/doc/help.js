var through = require('through2')

function help () {
/*
packmule - native web app release management tool

Usage:
    packmule [command] [directory] [options]

    with no command or directory, acts like `packmule serve .`

Commands:
    help            Show this message
    info            Display metadata about a directory (files, types, size, etc.)
    pack            Package files for release
    register        Register a release (without uploading any files)
    release         Pack, Upload and register a new release
    serve           Serve up a local release
    upload          Upload files for a release (without registering it)
    url             Print the URL a release will be at
    version         Show current version

General Options:
    -v, --verbose   Be chatty (default=false)
        --version   Show current packmule version

Command Options:
  pack: prepare files for upload (replace PACKMULE_RELEASE with URL of release in all input files)
  upload: upload files to the specified storage backend
  register: (re)register a release, skipping the upload
  release: pack, upload and register a release

    -c, --channel   name(s) of channels to tag the release on (default=[])
        --endpoint  API endpoint to register releases on
    -h, --host      host where releases can be found (default=localhost)
        --package   name of the package (default=package.json "name" field)
        --path      path releases can be found at on the server (default=/releases/)
    -p, --port      port where releases can be found or to serve local releases
                    on (default=6462)
    -r, --release   name of the release (default=current UNIX timestamp)
        --storage   backend storage to upload files to (default=s3)

  serve
    Serve a local directory on a packmule release URL

    -h, --host      host to listen on (default=localhost)
    -p, --port      port to listen on (default=6462)
    -r, --release   name of the release to serve (default=dev)

  url
    Output the URL a release would

    -h, --host      host to use in the URL (default=localhost)
    -p, --port      port to use in the URL (default=none)
        --path      path releases can be found at on the server (default=/releases/)
    -r, --release   name of the release (default=current UNIX timestamp)

Storage Options:
  s3
    Files are uploaded to the specified bucket with a prefix of [path]/[release].
    S3 credentials should be set as environment variables

    --bucket        the S3 bucket to upload files to
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
