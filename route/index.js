const user = require('../controller/user');
const file = require('../controller/upload');
const gitToken = require('../public/src/js/gitToken');
const request = require('request');

const { CLIENT_ID, CLIENT_SECRET, ACCESS_URL, USER_URL } = gitToken;

// 判断用户登录状态
const authority = (req, res, next) => {
  if (!req.session || !req.session.userName) {
    res.redirect('/login');
  } else {
    next();
  }
};

const apiAuth = (req, res, next) => {
  if (!req.session || !req.session.userName) {
    res.status(500).json({ msg: '请重新登录' });
  } else {
    next();
  }
};

module.exports = app => {
  app.post('/api/register', user.register);
  app.post('/api/login', user.login);
  app.get('/api/user', apiAuth, user.getUser);
  app.post('/api/upload', apiAuth, file.upload);
  app.get('/api/files', apiAuth, file.list);
  app.delete('/api/file', apiAuth, file.remove);
  app.get('/api/downloadFile', apiAuth, file.download);
  app.post('/api/directory', apiAuth, file.createDir);
  app.delete('/api/directory', apiAuth, file.removeDir);
  // get file md5
  app.get('/api/fileMd5', apiAuth, file.fileMd5);
  app.post('/api/merge', apiAuth, file.mergeFile);
  app.get('/api/readImage', apiAuth, file.readImage);
  app.get('/api/callback', (req, res) => {
    const { code } = req.query;
    const user_agent = req.get('user-agent');
    request(
      `${ACCESS_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`,
      (err, response, body) => {
        const access_token = body && body.split('&')[0];
        const url = `${USER_URL}?${access_token}`;
        request(
          {
            uri: url,
            headers: {
              'user-agent': user_agent,
              method: 'get'
            }
          },
          (err, resUser, userBody) => {
            console.log('userBody', userBody);
            console.log('userBody.userName', userBody.userName);
            console.log('typeof userBody', typeof userBody);
            const info = JSON.parse(userBody);
            req.session.userName = info.login;
            req.session.userId = info.id;
            req.session.github = true;
            res.redirect('/');
          }
        );
      }
    );
  });
  // 独立的登录页面 session过期或不存在都会重定向到这
  app.get(
    '/login',
    (req, res, next) => {
      if (req.session && req.session.userName) {
        // 已经登录过了有用户信息 则跳转/
        res.redirect('/');
      } else {
        next();
      }
    },
    (req, res) => {
      res.render('index');
    }
  );
  app.get('*', authority, (req, res) => {
    res.render('index');
  });
};
