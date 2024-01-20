const { readdir, mkdir, copyFile, unlink } = require('fs');
const path = require('path');

const filesPath = path.join(__dirname, 'files');
const copyFilesPath = path.join(__dirname, 'files-copy');

function copyDir() {
  mkdir(copyFilesPath, { recursive: true }, (err) => {
    if (err) console.log(err);
  });

  readdir(copyFilesPath, (_, copyFiles) => {
    copyFiles.forEach((copyFile) => {
      const copyFilePath = path.join(copyFilesPath, copyFile);
      unlink(copyFilePath, (err) => {
        if (err) return err;
      });
    });
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

copyDir();
