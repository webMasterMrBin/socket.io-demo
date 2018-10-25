const db = require('../model');

const mod = {
  register: async (req, res) => {
    const { userName, userPwd } = req.body;
    try {
      const userInfo = await db.user.findOne({ userName });
      if (!userInfo) {
        await db.user.create({ userName, userPwd });
        res.json({ status: 1, msg: '注册成功, 请重新登录' });
      } else {
        res.json({ status: 0, msg: '注册失败, 用户名已存在' });
      }
    } catch (e) {
      res.json(e);
    }
  },

  login: async (req, res) => {
    try {
      const { userName, userPwd } = req.body;
      const userInfo = await db.user.findOne({ userName });

      if (
        userInfo &&
        Object.keys(userInfo).length !== 0 &&
        userPwd === userInfo.userPwd
      ) {
        if (!req.session.userName) {
          req.session.userName = userName;
          req.session.userId = userInfo._id;
          res.json({ status: 1, msg: '第一次来这里, 欢迎' });
        } else {
          res.json({
            status: 1,
            msg: `欢迎登录, 用户${req.session.userName}`,
            userName
          });
        }
      } else {
        res.json({ status: 0, msg: '登录失败, 用户名或密码不正确' });
      }
    } catch (e) {
      res.json({ errMsg: e });
    }
  },

  getUser: async (req, res) => {
    try {
      if (req.session.github) {
        // github登录
        res.json({ status: 1, userInfo: { userName: req.session.userName } });
      } else if (req.session.userName) {
        // 用户已登录
        const userInfo = await db.user.findOne({
          userName: req.session.userName
        });
        res.json({ status: 1, userInfo });
      } else {
        res.json({ status: 0, msg: '请重新登录' });
      }
    } catch (e) {
      res.json({ errMsg: e });
    }
  }
};

module.exports = mod;
