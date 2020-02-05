const fs = require('fs');
const url = require('url');
const http = require('http');
const path = require('path');

const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
      req.pipe(writeStream);

      writeStream.on('error', (error) => {
        if (error.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File exists');
        } else {
          res.statusCode = 500;
          res.end('Internal server error');
          fs.unlink(filepath, () => {});
        }
      });

      writeStream.on('close', () => {
        res.statusCode = 201;
        res.end('file has been saved');
      });

      res.on('close', () => {
        if (res.finished) return;
        fs.unlink(filepath, () => {});
      });

      if (req.headers['content-length'] > 1e6) {
        res.statusCode = 413;
        res.end('File is too big!');
        return;
      }

      const limitStream = new LimitSizeStream({limit: 1e6});

      req.pipe(limitStream).pipe(writeStream);

      limitStream.on('error', (error) => {
        if (error.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end('File is too big');
        } else {
          res.statusCode = 500;
          res.end('Internal server error');
        }

        fs.unlink(filepath, () => {});
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
