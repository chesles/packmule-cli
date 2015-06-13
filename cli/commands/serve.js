var through = require('through2')
var http = require('http')
var path = require('path')
var st = require('st')
var chalk = require('chalk')

function log (req, res) {
  console.log('[%s] %s %s',
    chalk.yellow((new Date()).toUTCString()),
    chalk.cyan(req.method),
    chalk.blue(req.url)
  )
}

module.exports = function () {
  return through.obj(function (packmule, enc, done) {
    var server, static_mount, static_files
    var sockets = {}

    function log_listen () {
      var addr = server.address()
      var host = addr.address === '::'
        ? 'localhost'
        : addr.address

      console.log(
        chalk.yellow('Server started, serving'),
        chalk.cyan(packmule.config.source),
        chalk.yellow('at'),
        chalk.cyan(host + ':' + addr.port + static_mount)
      )
    }

    if (packmule.command === 'serve') {
      static_mount = path.normalize(['', packmule.config.path, packmule.config.release, ''].join('/'))
      static_files = st({
        path: packmule.config.source,
        url: static_mount,
        cache: false
      })

      server = http.createServer(function (req, res) {
        log(req, res)
        res.setHeader('Access-Control-Allow-Origin', '*')
        static_files(req, res, function () {
          res.writeHead(404, 'Not found')
          res.end('Not found')
        })
      })
      server.on('error', function (err) {
        return end(err)
      })
      server.on('connection', function (sock) {
        sockets[sock.remotePort] = sock
        sock.on('close', function () { delete sockets[sock.remotePort] })
      })

      process.once('SIGINT', function () {
        console.log(chalk.yellow('\b\bbuhbye!'))
        for (var id in sockets) {
          sockets[id].destroy()
        }
        server.close()
        end()
      })

      server.listen(packmule.config.port, log_listen)

    } else {
      return end()
    }

    function end (err) {
      return done(err, err ? null : packmule)
    }
  })
}
