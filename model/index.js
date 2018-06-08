const mongoose = require("mongoose");
const user = require("./user");

// mongose promise改用node
mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/userLogin");

const db = mongoose.connection;

db.on("error", () => {
  console.log("mongodb error");
});

db.once("open", function() {
  // we're connected!
  console.log("now connect mongodb");
});

const mod = {
  user
};

module.exports = mod;
