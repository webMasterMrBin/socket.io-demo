const user = require("../controller/user");
const file = require("../controller/upload");

// 判断用户登录状态
const authority = (req, res, next) => {
  if (!req.session || !req.session.userName) {
    res.redirect("/login");
  }
  next();
};

const apiAuth = (req, res, next) => {
  if (!req.session || !req.session.userName) {
    res.status(500).json({ msg: "请重新登录" })
  }
  next();
};

module.exports = app => {
  app.post("/api/register", user.register);
  app.post("/api/login", user.login);
  app.get("/api/user", apiAuth, user.getUser);
  app.post("/api/upload", apiAuth, file.upload);
  app.get("/api/files", apiAuth, file.list);
  // 独立的登录页面 session过期或不存在都会重定向到这
  app.get(
    "/login",
    (req, res, next) => {
      if (req.session && req.session.userName) {
        // 已经登录过了有用户信息 则跳转/
        res.redirect("/");
      }
      next();
    },
    (req, res) => {
      res.render("index");
    }
  );
  app.get("*", authority, (req, res) => {
    res.render("index");
  });
};
