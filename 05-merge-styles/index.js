const { readdir, readFile, createWriteStream } = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const stylesPath = path.join(__dirname, 'styles');

const bundleStream = createWriteStream(bundlePath);

readdir(stylesPath, { withFileTypes: true }, (_, styles) => {
  styles.forEach((style) => {
    const stylePath = path.join(stylesPath, style.name);
    if (style.isFile() && path.extname(stylePath) === '.css') {
      readFile(stylePath, (_, data) => {
        bundleStream.write(data.toString());
      });
    }
  });
});
