const fs = require('fs');
const path = require('path');
const { stdout, stdin } = require('process');
const readline = require('readline');

const newFilePath = path.join(__dirname, 'text.txt');
const newFileStream = fs.createWriteStream(newFilePath);

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

stdout.write('Hello! Please, write some text:\n');

rl.on('line', (data) => {
  if (data.toString() === 'exit') {
    closeConsole();
  } else {
    newFileStream.write(`${data}\n`);
  }
});

rl.on('SIGINT', closeConsole);

function closeConsole() {
  stdout.write('Thank you! Good luck with other course tasks and goodbye!');
  rl.close();
}
