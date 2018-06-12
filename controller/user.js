const db = require("../model");

const mod = {
  register: async (req, res, next) => {
    const { userName, userPwd } = req.body;
    try {
      const userInfo = await db.user.findOne({ userName });
      if (!userInfo) {
        const result = await db.user.create({ userName, userPwd });
        console.log("result", result);
        res.json({ status: 1, msg: "注册成功, 请重新登录" });
      } else {
        res.json({ status: 0, msg: "注册失败, 用户名已存在"});
      }
    } catch (e) {
      res.json(e);
    }
  },

  login: async (req, res, next) => {
    try {
      const { userName, userPwd } = req.body;
      const userInfo = await db.user.findOne({ userName });

      if (
        userInfo &&
        Object.keys(userInfo).length !== 0 &&
        userPwd === userInfo.userPwd
      ) {
        res.cookie("userName", userName, { maxAge: 300000 });
        if (!req.session.userName) {
          req.session.userName = userName;
          res.json({ status: 1, msg: "第一次来这里, 欢迎"});
        } else {
          res.json({ status: 1, msg: `欢迎登录, 用户${req.session.userName}`});
        }
      } else {
        res.json({ status: 0, msg: "登录失败, 用户名或密码不正确"});
      }

      console.log("cookie", req.cookies);
      console.log("req.session", req.session);
      console.log("req.session.id", req.session.id);
    } catch (e) {
      res.json({ errMsg: e });
    }
  },

};

module.exports = mod;
