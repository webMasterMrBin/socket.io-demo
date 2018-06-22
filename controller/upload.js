const multer = require("multer");
const db = require("../model");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}-${req.session.userId}`);
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
      const webkitRelativePath = req.query.path;
      const directoryPath = []; // 上传得文件夹内的路径
      // 上传的是文件夹
      if (req.body.uploadWay === "directory") {
        try {
          (async () => {
            const saveFile = _.map(req.files, (o, i) => {
              const pathName = req.body[`file${i}-path`].split("/");
              // 获取目录路径的名称
              pathName.length = pathName.length - 1;
              directoryPath.push(pathName.join("/"));
              // 存单个文件信息
              return db.file.create({
                fileId: req.session.userId,
                fileName: o.originalname,
                path: o.path,
                type: o.mimetype,
                modifiedDate: moment().format(),
                size: o.size,
                isDir: 0,
                webkitRelativePath: `${webkitRelativePath}${
                  webkitRelativePath !== "/" ? "/" : ""
                }${pathName.join("/")}`
              });
            });

            // 所有目录
            const finalDirectoryPath = directoryPath.filter((o, i, arr) => {
              return arr.indexOf(o) === i;
            });

            // 存目录
            const saveDirectory = _.map(finalDirectoryPath, (o, i) => {
              const directoryName = o.split("/");
              if (directoryName.length === 1) {
                // 一级目录
                return db.file.create({
                  fileId: req.session.userId,
                  fileName: directoryName[0],
                  path: "",
                  type: "",
                  modifiedDate: moment().format(),
                  size: 0,
                  isDir: 1,
                  webkitRelativePath: `${webkitRelativePath}${
                    webkitRelativePath !== "/" ? "/" : ""
                  }`
                });
              }

              const directoryName1 = directoryName[directoryName.length - 1];
              directoryName.length = directoryName.length - 1;

              return db.file.create({
                fileId: req.session.userId,
                fileName: directoryName1,
                path: "",
                type: "",
                modifiedDate: moment().format(),
                size: 0,
                isDir: 1,
                webkitRelativePath: `${webkitRelativePath}${
                  webkitRelativePath !== "/" ? "/" : ""
                }${directoryName.join("/")}`
              });
            });
            await Promise.all([...saveDirectory, ...saveFile]);
            res.json({ msg: "上传完成" });
          })();
        } catch (e) {
          res.status(500).json({ msg: e });
        }
      } else {
        // 上传单个文件
        try {
          (async () => {
            await db.file.create({
              fileId: req.session.userId,
              fileName: req.files[0].originalname,
              path: req.files[0].path,
              type: req.files[0].mimetype,
              modifiedDate: moment().format(),
              size: req.files[0].size,
              webkitRelativePath: webkitRelativePath
            });
            res.json({ msg: "上传完成" });
          })();
        } catch (e) {
          res.status(500).json({ msg: e });
        }
      }
    });
  },

  // list 当前路径所有文件
  list: async (req, res) => {
    try {
      const { path } = req.query;
      const result = await db.file
        .find({ fileId: req.session.userId, webkitRelativePath: path })
        .populate("fileId");
      res.json({ msg: "list file done", fileList: result });
    } catch (e) {
      res.status(500).json({ msg: e });
    }
  },

  // 新建文件夹目录
  createDir: async (req, res) => {
    const { directoryName, webkitRelativePath } = req.body;
    try {
      await db.file.create({
        fileId: req.session.userId,
        fileName: directoryName,
        path: "",
        type: "",
        modifiedDate: moment().format(),
        size: 0,
        isDir: 1,
        webkitRelativePath: webkitRelativePath
      });
      res.json({ msg: `新建文件夹${directoryName}成功` });
    } catch (e) {
      res.status(500).json({ msg: e });
    }
  },

  // 删除文件夹目录(文件夹  里面所有文件夹和文件)
  // removeDir: async (req, res) => {
  //   const { directoryName } = req.query;
  //   try {
  //     const removeCurrentDir = db.file.deleteOne({
  //       fileName: directoryName,
  //       isDir: 1
  //     });
  //     const removeChildDir = db.file.deleteMany({
  //       isDir: 1,
  //
  //     })
  //     const removeFile = db.file.deleteMany({
  //       fileName
  //     });
  //     await Promise.all([removeCurrentDir, removeFile]);
  //     res.json({ msg: `删除文件夹${directoryName}成功` });
  //   } catch (e) {
  //     res.status(500).json({ msg: e });
  //   }
  // },

  // 删除文件
  remove: (req, res) => {
    const { filePath, name } = req.query;

    // 文件存在则删除
    fs.access(filePath, err => {
      if (err) {
        res.status(500).json({ msg: "文件不存在" });
      } else {
        fs.unlink(filePath, err => {
          if (err) {
            res.status(500).json({ msg: "文件删除失败" });
          }

          // 从数据库删除该条文件信息
          try {
            (async () => {
              await db.file.deleteOne({ path: filePath });
              res.json({ msg: `文件${name}已删除` });
            })();
          } catch (e) {
            res.status(500).json({ msg: e });
          }
        });
      }
    });
  },

  // 下载文件
  download: (req, res) => {
    const { filePath, name } = req.query;
    fs.access(filePath, err => {
      if (err) {
        res.status(500).json({ msg: "文件不存在" });
      } else {
        res.set({
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename=${name}`
        });
        fs.createReadStream(filePath).pipe(res);
      }
    });
  }
};
