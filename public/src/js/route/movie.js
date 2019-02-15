const file = {
  path: 'movie',
  getComponents(location, cb) {
    require.ensure([], require => {
      cb(null, require('component/movie'));
    });
  },
};

module.exports = file;
