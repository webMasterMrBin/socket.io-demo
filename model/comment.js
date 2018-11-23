const mongoose = require('mongoose');

/*
  文章评论
  {
    "commentId": 1,
    "create_time": "2017-01-10T23:07:43.248Z",
    "author": {
      "id": 81,
      "name": "Mr Shelby"
    },
    content: ''
  }
*/
const listSchema = mongoose.Schema({
  commentId: mongoose.Schema.Types.ObjectId,
  create_time: { type: Date, default: Date.now },
  author: Object,
  content: String,
});

const comment = mongoose.model('comment', listSchema);

module.exports = comment;
