const Article = {
  path: 'article',
  childRoutes: [
    {
      path: 'detail/:articleId',
      getComponents(location, cb) {
        require.ensure([], require => {
          cb(null, require('component/article/detail'));
        });
      },
    },
  ],
  getComponents(location, cb) {
    require.ensure([], require => {
      cb(null, require('component/article'));
    });
  },
};

module.exports = Article;
