const mongoose = require("mongoose");
const user = require("./user");
const file = require("./file");

// mongose promise改用node
mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/userLogin", {
  server: {
    poolSize: 6, // 默认为5
    reconnectTries: 5, // 无限重连的节奏
    auto_reconnect: true,
  }
});

const db = mongoose.connection;

db.on("error", () => {
  console.log("mongodb error");
});

db.on("disconnected", function() {
  console.log("mongoose disconnected");
})

db.once("open", function() {
  // we're connected!
  console.log("now connect mongodb");
});

const mod = {
  user,
  file
};

module.exports = mod;
