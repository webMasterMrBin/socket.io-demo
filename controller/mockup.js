const multer = require('multer');
const fs = require('fs');
const unzip = require('unzip2');
const path = require('path');
const getTree = require('../lib/util');

// function handleCatch(promise, res) {
//   return promise.catch(() => {
//     res.status(500).json({ msg: 'sth wrong' });
//   });
// }

const uploadZip = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './zips/');
    },
    filename(req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5, // 每次上传的chunk5M以内
  },
}).any();

module.exports = {
  upload(req, res) {
    uploadZip(req, res, err => {
      if (err) {
        console.log('upload err', err);
        res.status(500).json({ msg: err });
        return;
      }

      res.json({ msg: '上传成功', zipName: req.files[0].filename });
    });
  },

  unzlib(req, res) {
    const { zipName } = req.body;
    const readable = fs.createReadStream(
      path.join(__dirname, `../zips/${zipName}`)
    );
    const directoryName = zipName.split('.zip')[0];
    readable.pipe(
      unzip.Extract({
        path: path.join(__dirname, `../mockups/${directoryName}`),
      })
    );
    readable.on('end', () => {
      res.status(200).json({ msg: '解压成功' });
    });
  },

  treeList(req, res) {
    const result = [];
    getTree(result);
    setTimeout(() => {
      res.status(200).json(result);
    }, 2000);
  },
};
