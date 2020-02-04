const fs = require('fs');
const url = require('url');
const http = require('http');
const path = require('path');

const LimitSizeStream = require('../../2-module/1-task/LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end();
        return;
      } else if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end();
      } else {
        const limitStream = new LimitSizeStream({limit: 2 ** 20});
        const writeStream = fs.createWriteStream(filepath);

        req.pipe(limitStream).pipe(writeStream);

        limitStream.on('error', (err) => {
          fs.unlink(filepath, () => {
            writeStream.destroy();
            limitStream.destroy();

            res.statusCode = 413;
            res.end();
          });
        });

        req.on('aborted', () => {
          fs.unlink(filepath, () => {
            writeStream.destroy();
            res.end();
          });
        });

        writeStream.on('error', () => {});

        writeStream.on('finish', () => {
          res.statusCode = 201;
          res.end();
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
