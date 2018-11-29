const mongoose = require('mongoose');

/*
  一遍文章的字段
  {
    "id": 1,
    "title": "Blog Title",
    "create_time": "2017-01-10T23:07:43.248Z",
    "author": '',
    "content": '',
    'description': '',
  }
*/
const listSchema = mongoose.Schema({
  articleId: String,
  title: String,
  create_time: { type: Date, default: Date.now },
  author: String,
  content: String,
  description: String,
});

const article = mongoose.model('article', listSchema);

module.exports = article;
