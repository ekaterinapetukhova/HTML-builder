const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const textPath = path.join(__dirname, 'text.txt');
const stream = new fs.ReadStream(textPath);

stream.on('data', function (chunk) {
  stdout.write(chunk.toString());
});
