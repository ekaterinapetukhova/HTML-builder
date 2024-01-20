const { readdir, stat } = require('fs');
const { stdout } = require('process');
const path = require('path');

const catalogPath = path.join(__dirname, 'secret-folder');

readdir(catalogPath, { withFileTypes: true }, (_, files) => {
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(catalogPath, file.name);
      stat(filePath, (_, stats) => {
        stdout.write(
          `${file.name.slice(0, file.name.indexOf('.'))} - ${path
            .extname(filePath)
            .slice(1)} - ${stats.size} bytes\n`,
        );
      });
    }
  });
});
