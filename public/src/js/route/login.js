const login = {
  path: "login",
  getComponents(location, cb) {
    require.ensure([], require => {
      cb(null, require("component/login"));
    });
  }
};

module.exports = login;
