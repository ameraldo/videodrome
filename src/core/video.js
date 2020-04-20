const fs = require('fs');
const path = require('path');
const os = require('os');


const rootDir = os.homedir();

function checkFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK && fs.constants.R_OK, (error) => {
      if (error) return reject(error);
      const splitPath = filePath.split('/');
      const fileName = splitPath[splitPath.length - 1];
      const splitFile = fileName.split('.');
      const mimeType = splitFile[splitFile.length - 1];
      return resolve({ valid: true, mimeType });
    });
  });
}

function getStats(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (error, stats) => {
      if (error) return reject(error);
      return resolve(stats);
    });
  });
}


module.exports = {
  async view(req, res) {
    const filePath = req.query.path ? req.query.path : null;
    try {
      if (!filePath) return res.render('video', { error: true });
      await checkFile(path.join(rootDir, filePath));
      return res.render('video', { path: filePath });
    } catch (error) {
      return res.render('video', { error: true });
    }
  },
  async stream(req, res) {
    const filePath = req.query.path ? req.query.path : null;
    try {
      if (!filePath) return res.sendStatus(404);
      const file = await checkFile(path.join(rootDir, filePath));
      if (!file.valid) return res.sendStatus(404);
      const stats = await getStats(path.join(rootDir, filePath));
      if (req.headers.range) {
        const { range } = req.headers;
        const positions = range.replace(/bytes=/, '').split('-');
        const start = parseInt(positions[0], 10);
        const end = positions[1] ? parseInt(positions[1], 10) : stats.size - 1;
        const chunkSize = (end - start) + 1;
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stats.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': `video/${file.mimeType}`,
        });
        return fs.createReadStream(path.join(rootDir, filePath), { start, end }).pipe(res);
      }
      res.writeHead(200, {
        'Content-Length': stats.size,
        'Content-Type': `video/${file.mimeType}`,
      });
      return fs.createReadStream(path.join(rootDir, filePath)).pipe(res);
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};
