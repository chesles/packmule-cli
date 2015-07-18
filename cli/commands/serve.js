var through = require('through2')
var http = require('http')
var path = require('path')
var fs = require('fs')
var st = require('st')
var chalk = require('chalk')

function log_request (req, res) {
  console.log('[%s] %s %s',
    chalk.yellow((new Date()).toUTCString()),
    chalk.cyan(req.method),
    chalk.blue(req.url)
  )
}

module.exports = function () {
  return through.obj(function (packmule, enc, done) {
    var server, mount_path, static_files, ok_file
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
        chalk.cyan(host + ':' + addr.port + mount_path)
      )
    }
    function handle_request (req, res) {
      function catchall () {
        var ok = fs.createReadStream(ok_file)
        ok.on('error', function (err) {
          console.warn(err)
          res.writeHead(404, 'Not found')
          res.end('Not found')
        })
        ok.pipe(res)
      }

      log_request(req, res)
      res.setHeader('Access-Control-Allow-Origin', '*')
      static_files(req, res, catchall)
    }

    if (packmule.command === 'serve') {

      mount_path = [
        '',
        packmule.config.path,
        packmule.config.release,
        ''
      ].join('/')
      mount_path = path.normalize(mount_path)

      static_files = st({
        path: packmule.config.source,
        url: mount_path,
        cache: false
      })
      ok_file = path.join(packmule.config.source, '200.html')

      server = http.createServer(handle_request)
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

      server.listen(packmule.config.port, packmule.config.host, log_listen)

    } else {
      return end()
    }

    function end (err) {
      return done(err, err ? null : packmule)
    }
  })
}
