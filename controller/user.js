const db = require("../model");

const mod = {
  register: async (req, res, next) => {
    const { userName, userPwd } = req.body;
    try {
      const userList = await db.user.find();
      if (userList.filter(o => userName === o.userName).length === 0) {
        const result = await db.user.create({ userName, userPwd });
        console.log("result", result);
        res.json("注册成功, 请重新登录");
      } else {
        res.status(500).json("注册失败, 用户名已存在");
      }

      /* 延时处理 */
      // await new Promise(resolve => {
      //   setTimeout(() => resolve("done"), 5000);
      // });
    } catch (e) {
      res.json(e);
    }
  },

  login: async (req, res, next) => {
    try {
      const { userName, userPwd } = req.body;
      const userList = await db.user.find();
      userList.forEach(o => {
        if (o.userName === userName && o.userPwd === userPwd) {
          res.json("登录成功");
        }
      });
      res.json(userList);
    } catch (e) {
      res.json({ errMsg: e });
    }
  }
}

module.exports = mod;
