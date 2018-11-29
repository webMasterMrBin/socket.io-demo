const mongoose = require('mongoose');

/*
  文章评论
  {
    "commentId": 1,
    "articleId"
    "create_time": "2017-01-10T23:07:43.248Z",
    "author"
    comment: ''

  }
*/
const listSchema = mongoose.Schema({
  commentId: String,
  articleId: String,
  create_time: { type: Date, default: Date.now },
  author: String,
  comment: String,
});

const comment = mongoose.model('comment', listSchema);

module.exports = comment;
