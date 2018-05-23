const express = require('express');
const path = require('path');

const app = express();
const logger = require('morgan');
// view engine setup
app.set('views', path.join(__dirname, 'public/page'));

app.set('view engine', 'ejs');

// 可以访问public下的静态资源
app.use(express.static(path.join(__dirname, 'public')));

// 开发环境日志
app.use(logger('dev'));

// 引入路由
require('./route')(app);

module.exports = app;
