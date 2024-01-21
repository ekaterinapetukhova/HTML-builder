const path = require('path');
const {
  mkdir,
  readdir,
  createReadStream,
  readFile,
  createWriteStream,
  writeFile,
  unlink,
  copyFile,
} = require('fs');

// BUILD PATHES
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');

// DIST PATHES
const projectDistPath = path.join(__dirname, 'project-dist');
const htmlDistPath = path.join(projectDistPath, 'index.html');
const stylesDistPath = path.join(projectDistPath, 'style.css');
const assetsDistPath = path.join(projectDistPath, 'assets');

// CREATE DIST FOLDER
mkdir(projectDistPath, { recursive: true }, (err) => {
  if (err) console.log(err);
});

// REPLACE TAGS IN THE TEMPLATE FILE WITH DATA FROM COMPONENTS FILES
const templateReadStream = createReadStream(templatePath);

templateReadStream.on('data', (data) => {
  data = data.toString();

  readdir(componentsPath, { withFileTypes: true }, (err, components) => {
    if (err) {
      console.log(err);
    } else {
      components.forEach((component) => {
        const componentPath = path.join(componentsPath, component.name);
        const componentStream = createReadStream(componentPath);
        const componentName = component.name.slice(
          0,
          component.name.indexOf('.html'),
        );

        let reg = new RegExp(`{{${componentName}}}`);

        if (component.isFile() && path.extname(componentPath) === '.html') {
          componentStream.on('data', (componentData) => {
            data = data.replace(reg, componentData.toString());

            // WRITE INTO DIST HTML FILE COMPONENT DATA
            writeFile(htmlDistPath, data, (err) => {
              if (err) console.log(err);
            });
          });
        }
      });
    }
  });
});

// UNION STYLES INTO DIST  CSS FILE
const stylesStream = createWriteStream(stylesDistPath);

readdir(stylesPath, { withFileTypes: true }, (_, styles) => {
  styles.forEach((style) => {
    const stylePath = path.join(stylesPath, style.name);
    if (style.isFile() && path.extname(stylePath) === '.css') {
      readFile(stylePath, (_, data) => {
        stylesStream.write(data.toString());
      });
    }
  });
});

// COPY ASSETS INTO DIST
mkdir(assetsDistPath, { recursive: true }, (err) => {
  if (err) console.log(err);
});

readdir(assetsPath, { withFileTypes: true }, (_, assetsFolders) => {
  assetsFolders.forEach((assetsFolder) => {
    const assetsDistFolderPath = path.join(assetsDistPath, assetsFolder.name);
    const assetsFolderPath = path.join(assetsPath, assetsFolder.name);
    copyDir(assetsDistFolderPath, assetsFolderPath);
  });
});

function copyDir(copyFilesPath, filesPath) {
  mkdir(copyFilesPath, { recursive: true }, (err) => {
    if (err) console.log(err);
  });

  readdir(copyFilesPath, (_, copyFiles) => {
    if (copyFiles) {
      copyFiles.forEach((copyFile) => {
        const copyFilePath = path.join(copyFilesPath, copyFile);
        unlink(copyFilePath, (err) => {
          if (err) return err;
        });
      });
    }
  });

  readdir(filesPath, (_, files) => {
    files.forEach((file) => {
      const filePath = path.join(filesPath, file);
      const copyFilePath = path.join(copyFilesPath, file);

      copyFile(filePath, copyFilePath, (err) => {
        if (err) console.log(err);
      });
    });
  });
}
