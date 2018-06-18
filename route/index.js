const user = require("../controller/user");

// 判断用户登录状态
const authority = (req, res, next) => {
  if (!req.session || !req.session.userName) {
    res.redirect("/login");
  }
  next();
};

module.exports = app => {
  app.post("/api/register", user.register);
  app.post("/api/login", user.login);
  app.get("/api/user", user.getUser);
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
