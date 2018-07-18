const user = require("../controller/user");
const file = require("../controller/upload");
const fs = require("fs");
const path = require("path");

// 判断用户登录状态
const authority = (req, res, next) => {
  if (!req.session || !req.session.userName) {
    res.redirect("/login");
  } else {
    next();
  }
};

const apiAuth = (req, res, next) => {
  if (!req.session || !req.session.userName) {
    res.status(500).json({ msg: "请重新登录" });
  } else {
    next();
  }
};

module.exports = app => {
  app.post("/api/register", user.register);
  app.post("/api/login", user.login);
  app.get("/api/user", apiAuth, user.getUser);
  app.post("/api/upload", apiAuth, file.upload);
  app.get("/api/files", apiAuth, file.list);
  app.delete("/api/file", apiAuth, file.remove);
  app.get("/api/downloadFile", apiAuth, file.download);
  app.post("/api/directory", apiAuth, file.createDir);
  app.delete("/api/directory", apiAuth, file.removeDir);
  app.get("/api/progress", apiAuth, (req, res) => {
    fs.readFile(path.join(
      __dirname,
      "../../../Downloads/毒枭.Narcos.S02E09.中英字幕.WEB-HR.AAC.1024X576.x264.mp4"
      ),
      (err, data) => {
        if (err) {
          console.log(err);
        }
        res.json(data);
      }
    );
  });
  // 独立的登录页面 session过期或不存在都会重定向到这
  app.get(
    "/login",
    (req, res, next) => {
      if (req.session && req.session.userName) {
        // 已经登录过了有用户信息 则跳转/
        res.redirect("/");
      } else {
        next();
      }
    },
    (req, res) => {
      res.render("index");
    }
  );
  app.get("*", authority, (req, res) => {
    res.render("index");
  });
};
