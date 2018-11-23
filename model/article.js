const mongoose = require('mongoose');

/*
  文章列表
  {
    "id": 1,
    "title": "Blog Title",
    "create_time": "2017-01-10T23:07:43.248Z",
    "author": {
      "id": 81,
      "name": "Mr Shelby"
    }
  }
*/
const listSchema = mongoose.Schema({
  articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'comment' },
  title: String,
  create_time: { type: Date, default: Date.now },
  author: Object,
  content: String,
});

const article = mongoose.model('article', listSchema);

module.exports = article;
