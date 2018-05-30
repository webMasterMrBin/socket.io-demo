const child = {
  path: "child",
  getComponents(location, cb) {
    require.ensure([], require => {
      cb(null, require("component/child"));
    });
  }
};

export { child };
