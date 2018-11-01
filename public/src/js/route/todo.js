const todo = {
  path: 'todo',
  getComponents(location, cb) {
    require.ensure([], require => {
      cb(null, require('component/todo'));
    });
  },
};

module.exports = todo;
