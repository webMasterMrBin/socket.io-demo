const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  fileName: String, // 文件名
  path: String, // 路径
  type: String, // 文件类型
  modifiedDate: String, // 文件修改时间
  size: Number,
  date: { type: Date, default: Date.now }
});

const file = mongoose.model("file", fileSchema);

module.exports = file;
