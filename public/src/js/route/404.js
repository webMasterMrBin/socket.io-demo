import { Button } from "antd";
import { browserHistory } from "react-router";
import { Layout, Menu, Icon, Dropdown } from "antd";
import Main from "component/public/layout";

const NotFound = () => (
  <Main>
    <div>
      页面不存在
      <Button onClick={() => browserHistory.replace("/")}>返回首页</Button>
    </div>
  </Main>
);

module.exports = {
  path: "*",
  component: NotFound
};
