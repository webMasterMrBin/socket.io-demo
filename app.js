const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const redisStore = require("connect-redis")(session);

const app = express();
const logger = require('morgan');
// view engine setup
app.set('views', path.join(__dirname, 'public/page'));

app.set('view engine', 'ejs');

// 可以访问public下的静态资源
app.use(express.static(path.join(__dirname, 'public')));

// 开发环境日志
app.use(logger('dev'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // use cookie

const store = new redisStore({
  ttl: 1000 * 60 * 5
});

app.use(session({
  store: store,
  secret: "random string",
  cookie: { maxAge: 300000 }
}));

app.get("/api/logout", (req, res) => {
  if (req.session.test) {
    store.destroy(req.session.id, () => {
      req.session.destroy(() => {
        res.json({ status: 0, msg: "请重新登录"});
      });
    });
  }
});

// 引入路由
require('./route')(app);

// 捕获错误
app.use((req, res, next) => {
  // err.status = 404;
  next(new Error("Not Found"));
});

// 错误处理
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send("ERROR");
});

module.exports = app;
