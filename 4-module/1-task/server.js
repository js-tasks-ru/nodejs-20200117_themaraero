const fs = require('fs');
const url = require('url');
const http = require('http');
const path = require('path');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (fs.existsSync(filepath)) {
        res.statusCode = 200;
        const readStream = fs.createReadStream(filepath);

        readStream.on('open', () => {
          readStream.pipe(res);
        });

        readStream.on('error', () => {
          res.statusCode = 500;
          res.end();
        });

        readStream.on('close', () => {
          res.end();
        });
      } else if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 404;
        res.end();
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
