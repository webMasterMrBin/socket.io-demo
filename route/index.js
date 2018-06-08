const user = require("../controller/user");

module.exports = app => {
  app.post("/api/register", user.register);
  app.post("/api/login", user.login);
  app.get("*", (req, res) => {
    res.render("index");
  });
};
