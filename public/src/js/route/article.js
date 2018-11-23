const Article = {
  path: 'article',
  getComponents(location, cb) {
    require.ensure([], require => {
      cb(null, require('component/article'));
    });
  },
};

module.exports = Article;
