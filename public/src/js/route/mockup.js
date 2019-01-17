const mockup = {
  path: 'mockup',
  getComponents(location, cb) {
    require.ensure([], require => {
      cb(null, require('component/mockup'));
    });
  },
};

module.exports = mockup;
