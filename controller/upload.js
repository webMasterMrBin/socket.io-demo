const multer = require("multer");
const db = require("../model");
const moment = require("moment");
const fs = require("fs");
const _ = require("lodash");
const { promisify } = require("util");
const uploadsPath =
  process.env.NODE_ENV === "production"
    ? "/mysocketdemoFile/uploads/"
    : "./uploads/"; // 文件存储路径
const chunksPath =
  process.env.NODE_ENV === "production"
    ? "/mysocketdemoFile/chunks/"
    : "./chunks/";

const uploadChunk = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, req.body.total === "1" ? uploadsPath : chunksPath);
    },
    filename(req, file, cb) {
      cb(
        null,
        req.body.total === "1"
          ? `${req.session.userId}-${req.body.fileName}`
          : `${req.body.index}-${req.body.md5}-${req.session.userId}`
      );
    }
  }),
  limits: {
    fileSize: 1024 * 1024 * 5 // 每次上传的chunk5M以内
  }
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
        return;
      }
      const webkitRelativePath = req.query.path;
      const directoryPath = []; // 上传得文件夹内的路径
      const { fileName } = req.body;
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
            const saveDirectory = _.map(finalDirectoryPath, o => {
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
        // 只有一个chunk
        if (req.body.total == 1) {
          saveToMongo(
            req,
            () =>
              res.json({
                msg: `文件${fileName}上传完成`,
                exis: true,
                uploadChunks: [],
                broken: false
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
    const { fileName, type, size, webkitRelativePath, md5 } = req.body;
    const writeable = fs.createWriteStream(
      `${uploadsPath}${req.session.userId}-${fileName}`
    );
    fs.readdir(chunksPath, (err, files) => {
      if (err) {
        res.status(500).json({ msg: "读取文件chunks list失败" });
      }
      // 排序过的chunks
      const uploadChunks = files.filter(o => o.includes(md5)).sort((a, b) => {
        return a.split("-")[0] - b.split("-")[0];
      });

      const chunks = _.cloneDeep(uploadChunks);

      /* 从chunks里读取内容写到uploads文件中
        node合并文件该功能代码参考https://blog.ragingflame.co.za/2013/5/31/using-nodejs-to-join-audio-files
      */
      async function pipe() {
        if (!chunks.length) {
          writeable.end(); // 手动关闭可写流
          await Promise.all(
            uploadChunks.map(o => unlink(res, `${chunksPath}${o}`))
          );
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
          return res.json({
            msg: `文件${fileName}上传完成`,
            exis: true,
            uploadChunks: [],
            broken: false
          });
        } else {
          const readable = fs.createReadStream(
            `${chunksPath}${chunks.shift()}`
          );
          readable.pipe(writeable, { end: false });
          readable.on("end", () => {
            pipe();
          });
          readable.on("error", () => {
            res.status(500).json({
              msg: "合并文件出错",
              exis: false,
              uploadChunks,
              broken: true
            });
          });
        }
      }

      pipe();
    });
  },

  fileMd5: async (req, res) => {
    try {
      const { md5, fileSize } = req.query;
      const statAsync = promisify(fs.stat);
      const result = await db.file.find({
        fileId: req.session.userId,
        md5: md5
      });
      fs.readdir(chunksPath, (err, files) => {
        const chunks = files.filter(o => o.includes(md5)).sort((a, b) => {
          return a.split("-")[0] - b.split("-")[0];
        });
        if (err) {
          res.status(500).json({ msg: "读取file chunks失败" });
        }

        if (_.isEmpty(result)) {
          if (!_.isEmpty(chunks)) {
            // 找到chunks里所有文件大小总和比较是否上传完整
            Promise.all(chunks.map(o => statAsync(`${chunksPath}${o}`))).then(
              data => {
                const sum = data.reduce((a, b) => a + b.size, 0);
                res.json({
                  msg: "文件md5不存在",
                  exis: false,
                  uploadChunks: chunks,
                  broken: sum !== fileSize ? true : false
                });
              }
            );
          } else {
            res.json({
              msg: "文件md5不存在",
              exis: false,
              uploadChunks: chunks,
              broken: false
            });
          }
        } else {
          res.json({
            msg: "文件已上传, 存在md5",
            exis: true,
            uploadChunks: chunks,
            broken: false
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
  remove: async (req, res) => {
    const { filePath, name } = req.query;
    try {
      const files = await promisify(fs.readdir)(uploadsPath);
      const file = files.find(
        o => o.includes(name) && o.includes(req.session.userId)
      );
      await unlink(res, `${uploadsPath}${file}`);
      await db.file.deleteOne({
        fileId: req.session.userId,
        path: filePath,
        fileName: name
      });
      res.json({ msg: `文件${name}已删除` });
    } catch (e) {
      res.status(500).json({ msg: "something wrong" });
    }
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
