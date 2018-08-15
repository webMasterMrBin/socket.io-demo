const multer = require("multer");
const db = require("../model");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const uploadChunk = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, req.body.total === "1" ? "./uploads/" : "./chunks/");
    },
    filename: (req, file, cb) => {
      console.log("req body", req.body);
      cb(
        null,
        req.body.total === "1"
          ? `${req.session.userId}-${req.body.fileName}`
          : `${req.body.index}-${req.body.md5}-${req.session.userId}`
      );
    }
  })
}).any();

function unlink(res, filePath) {
  return new Promise((resolve, reject) => {
    fs.access(filePath, err => {
      if (err) {
        reject("文件不存在");
        res.status(500).json({ msg: "文件不存在" });
      } else {
        fs.unlink(filePath, err => {
          if (err) {
            reject(err);
          } else {
            resolve("文件删除成功");
          }
        });
      }
    });
  });
}

async function saveToMongo(req, res, err) {
  const { fileName, type, size, webkitRelativePath, md5 } = req.body;
  try {
    await db.file.create({
      fileId: req.session.userId,
      fileName,
      path: "/uploads", // multer 已上传文件的完整路径
      type,
      modifiedDate: moment().format(),
      size,
      webkitRelativePath,
      md5,
      isdir: 0
    });
    res();
  } catch (e) {
    console.log("error", e);
    err(e);
  }
}

module.exports = {
  upload: (req, res) => {
    uploadChunk(req, res, err => {
      if (err) {
        console.log("upload err", err);
        res.status(500).json({ msg: err });
      }
      const webkitRelativePath = req.query.path;
      const directoryPath = []; // 上传得文件夹内的路径
      const { md5, fileName } = req.body;
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
        if (req.body.total == 1) {
          saveToMongo(
            req,
            () =>
              res.json({
                msg: `文件${fileName}上传完成`,
                exis: true,
                uploadChunks: []
              }),
            e => res.status(500).json({ msg: e })
          );
        } else {
          res.json({
            msg: `chunk ${req.body.index}-${req.body.md5}-${
              req.session.userId
            }上传完成`
          });
        }
      }
    });
  },

  mergeFile(req, res) {
    const { md5, fileName, type, size, webkitRelativePath } = req.body;
    const chunks = [];
    const writeable = fs.createWriteStream(
      `./uploads/${req.session.userId}-${fileName}`
    );
    fs.readdir("./chunks", (err, files) => {
      if (err) {
        res.status(500).json({ msg: "读取文件chunks list失败" });
      }
      const uploadChunks = files.filter(o => o.includes(md5));
      uploadChunks.forEach(o => {
        chunks.push(o);
      });

      // 从chunks里读取内容写到uploads文件中
      function pipe() {
        if (!chunks.length) {
          writeable.end("Done"); // 手动关闭可写流
          return;
        }
        const readable = fs.createReadStream(`./chunks/${chunks.shift()}`);
        readable.pipe(writeable, { end: false });
        readable.on("end", () => {
          pipe();
        });
        readable.on("error", () => {
          res.status(500).json({ msg: "合并文件出错", exis: false, uploadChunks });
        });
      }

      pipe();

      saveToMongo(
        req,
        () =>
          res.json({
            msg: `文件${fileName}合并成功`,
            exis: true,
            uploadChunks
          }),
        e => res.json({ msg: e })
      );
    });
  },

  fileMd5: async (req, res) => {
    try {
      const { md5 } = req.query;
      const result = await db.file.find({
        fileId: req.session.userId,
        md5: md5
      });
      fs.readdir("./chunks", (err, files) => {
        const chunks = files.filter(o => o.includes(md5));
        if (err) {
          res.status(500).json({ msg: "读取file chunks失败" });
        }
        if (_.isEmpty(result)) {
          res.json({ msg: "文件md5不存在", exis: false, uploadChunks: chunks });
        } else {
          res.json({
            msg: "文件已上传, 存在md5",
            exis: true,
            uploadChunks: chunks
          });
        }
      });
    } catch (e) {
      res.status(500).json({ msg: e });
    }
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
      res.status(500).json("服务器错误");
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
  removeDir: async (req, res) => {
    const { directoryName, webkitRelativePath } = req.query;
    try {
      // 文件存储的实际路径
      const files = await db.file.find({
        fileId: req.session.userId,
        isDir: 0,
        webkitRelativePath: new RegExp(
          `^${
            webkitRelativePath === "/" ? "/" : webkitRelativePath
          }${directoryName}`
        )
      });

      const unlinkFromUpload = files.map(o => {
        return unlink(res, o.path);
      });

      const removeCurrentDir = db.file.deleteOne({
        fileId: req.session.userId,
        fileName: directoryName,
        isDir: 1
      });

      // 该目录下所有文件夹和文件
      const removeChild = db.file.deleteMany({
        fileId: req.session.userId,
        webkitRelativePath: new RegExp(
          `^${
            webkitRelativePath === "/" ? "/" : webkitRelativePath
          }${directoryName}`
        )
      });
      // db里面删数据和从uploads删文件同时执行
      await Promise.all([removeCurrentDir, removeChild, ...unlinkFromUpload]);

      res.json({ msg: `删除文件夹${directoryName}成功` });
    } catch (e) {
      res.status(500).json({ msg: e });
    }
  },

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
              await db.file.deleteOne({
                fileId: req.session.userId,
                path: filePath
              });
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
