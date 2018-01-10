var http = require('http')
  , exec = require('exec')

const PORT = 3389
  , PATH = '../blogline'

var deployServer = http.createServer(function(request, response) {
  if (request.url.search(/pull\/?$/i) > 0) {

    var commands = [
      'cd ' + PATH,
      'git pull'
    ].join(' && ')
    exec(commands, function(err, out, code) {
      if (err instanceof Error) {
        response.writeHead(500)
        response.end('Server Internal Error.')
        throw err
      }
      process.stderr.write(err)
      process.stdout.write(out)
      response.writeHead(200)
        console.log("触发pull2")
      response.end('Deploy Done.')

    })

  } else {

    response.writeHead(404)
    response.end('Not Found.')

  }
})

deployServer.listen(PORT)
