const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.message = '';
  }

  _transform(chunk, encoding, callback) {
    this.message += chunk.toString();

    if (this.message.includes(os.EOL)) {
      const parts = this.message.split(os.EOL);

      this.push(parts[0]);
      this.message = parts[1];
    }

    callback();
  }

  _flush(callback) {
    this.push(this.message);
    callback();
  }
}

module.exports = LineSplitStream;
