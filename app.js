const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const redisStore = require("connect-redis")(session);
const app = express();
const logger = require('morgan');
const methods = [ 'get', 'post', 'put', 'delete' ];

// view engine se"get", "post", "put", "delete"
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
  ttl: 1000 * 60 * 60 * 8
});

app.use(session({
  store: store,
  secret: "random string",
  cookie: { maxAge: 1000 * 60 * 60 * 8 }
}));

app.use((req, res, next) => {
  console.log("login req.session", req.session);
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");

  next();
});

app.get("/api/logout", (req, res) => {
  if (req.session.userName) {
    store.destroy(req.session.id, () => {
      req.session.destroy(() => {
        res.json({ status: 1, msg: "请重新登录"});
      });
    });
  } else {
    res.json({ status: 0, msg: "请确认登录状态" });
  }
});

// NOTE http://liu-xin.me/2017/10/07/%E8%AE%A9Express%E6%94%AF%E6%8C%81async-await/
// express支持 async await 的错误捕获  使得不用每个方法try..catch
for (let method of methods) {
  app[method] = function(...data) {
    if (method === 'get' && data.length === 1) return app.set(data[0]);
    const params = [];
    for (let item of data) {
      if (Object.prototype.toString.call(item) !== '[object AsyncFunction]') {
        params.push(item);
        continue;
      }
      const handle = function(...data) {
        const [ req, res, next ] = data;
        item(req, res, next).then(next).catch(next);
      };
      params.push(handle);
    }
  };
}

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
