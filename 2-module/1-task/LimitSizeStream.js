const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.size = 0;
  }

  _transform(chunk, encoding, callback) {
    this.size += Buffer.byteLength(chunk);

    if (this.size > this.limit) {
      callback(new LimitExceededError());
    } else {
      this.push(chunk);
      callback();
    }
  }
}

module.exports = LimitSizeStream;
