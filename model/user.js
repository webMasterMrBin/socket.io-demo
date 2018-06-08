const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userName: String,
  userPwd: String,
  date: { type: Date, default: Date.now }
})

const user = mongoose.model("user", userSchema);

module.exports = user;
