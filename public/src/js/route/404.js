import { Button } from "antd";
import { browserHistory } from "react-router";

const NotFound = () => (
  <div>
    页面不存在
    <Button onClick={() => browserHistory.replace("/")}>返回首页</Button>
  </div>
);

module.exports = {
  path: "*",
  component: NotFound
};
