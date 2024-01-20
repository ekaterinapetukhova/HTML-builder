const { ReadStream } = require('fs');
const path = require('path');
const { stdout } = require('process');

const textPath = path.join(__dirname, 'text.txt');
const stream = new ReadStream(textPath);

stream.on('data', (data) => {
  stdout.write(data.toString());
});
