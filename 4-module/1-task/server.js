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
      const readStream = fs.createReadStream(filepath);
      readStream.pipe(res);

      readStream.on('error', (error) => {
        if (error.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('File not found');
        } else {
          res.statusCode = 500;
          res.end('Internal server error');
        }
      });

      res.on('close', () => {
        if (res.finished) return;
        readStream.destroy();
      });

      if (pathname.includes('/') || pathname.includes('..')) {
        res.statusCode = 400;
        res.end('Nested paths are not allowed');
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
