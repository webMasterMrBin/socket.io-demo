const multer = require("multer");
const db = require("../model");
const moment = require("moment");
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now());
    }
  })
}).any();

module.exports = {
  upload: (req, res) => {
    upload(req, res, err => {
      if (err) {
        console.log("upload err", err);
        res.status(500).json({ msg: err });
      }
      console.log("req.files", req.files);
      try {
        (async () => {
          await db.file.create({
            fileId: req.session.userId,
            fileName: req.files[0].originalname,
            path: req.files[0].path,
            type: req.files[0].mimetype,
            modifiedDate: moment().format(),
            size: req.files[0].size
          });
          res.json({ msg: "上传完成" });
        })();
      } catch (e) {
        res.status(500).json({ msg: e });
      }
    });
  },

  // list 当前路径所有文件
  list: async (req, res) => {
    try {
      const result = await db.file
        .find({ fileId: req.session.userId })
        .populate("fileId");
      console.log("list file result", result);
      res.json({ msg: "list file done", fileList: result });
    } catch (e) {
      res.status(500).json({ msg: e });
    }
  }
};
