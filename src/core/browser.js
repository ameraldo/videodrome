const fs = require('fs');
const path = require('path');
const os = require('os');


const rootDir = os.homedir();

/**
 * @function readDir
 * @param {String} dir
 */
function readDir(dir) {
  /**
   * Get stats for each item in directory in order to check if it is a path or a file.
   * @param {String} dirPath
   * @param {String} name
   */
  function _getStats(dirPath, name) {
    return new Promise((resolve, reject) => {
      fs.stat(dirPath, (error, stats) => {
        if (error) return reject(error);
        return resolve({ stats, name });
      });
    });
  }

  return new Promise((resolve, reject) => {
    const promises = [];
    fs.readdir(dir, async (error, dirArray) => {
      if (error) return reject(error);
      dirArray.forEach((name) => promises.push(_getStats(path.join(dir, name), name)));
      try {
        const response = await Promise.all(promises);
        return resolve(response);
      } catch (statsError) {
        return reject(statsError);
      }
    });
  });
}

/**
 * @param {String} currentPath
 */
function getPreviousPath(currentPath) {
  const pathArr = currentPath.split('/');
  pathArr.pop();
  let result = '';
  pathArr.forEach((i) => { if (i.length > 0) result += `/${i}`; });
  return result;
}

function checkFile(fileName) {
  const supportedMimeTypes = ['avi', 'mpeg', 'mp4', 'ogg', 'ogv', 'ts', 'webm', '3gp', '3g2'];
  const splitFile = fileName.split('.');
  const mimeType = splitFile[splitFile.length - 1];
  const supported = supportedMimeTypes.includes(mimeType);
  return { supported, mimeType };
}


module.exports = async (req, res) => {
  const currentPath = req.query.path ? req.query.path : '';
  const previousPath = getPreviousPath(currentPath);

  const response = await readDir(path.join(rootDir, currentPath));
  const dir = [];
  response.forEach((item) => {
    if (item.stats.isDirectory()) {
      dir.push({ name: item.name, type: 'dir' });
    } else if (item.stats.isFile() && checkFile(item.name).supported) {
      dir.push({ name: item.name, type: 'file' });
    }
  });

  res.render('browser', { dir, path: { currentPath, previousPath } });
};
