const file = {
  path: "chat",
  getComponents(location, cb) {
    require.ensure([], require => {
      cb(null, require("component/chat"));
    });
  }
};

module.exports = file;
