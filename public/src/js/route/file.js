const file = {
  path: "file",
  getComponents(location, cb) {
    require.ensure([], require => {
      cb(null, require("component/file"));
    });
  }
};

module.exports = file;
