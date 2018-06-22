import { connect } from "react-redux";
import WindowOpen from "./windowOpen";
import MessageOpen from "./messageOpen";
import { bindActionCreators } from "redux";
import * as userAction from "action/user";
import { Layout, Menu, Icon, Dropdown, Button } from "antd";
import PropTypes from "prop-types";
import { Link } from "react-router";
const { Header, Sider, Content } = Layout;

class Main extends React.Component {
  componentDidMount() {
    const { GetUser } = this.props;
    GetUser();
  }

  render() {
    const {
      home: { windowOpen, errMsg, messageOpen, doneMsg },
      user: { userName },
      Logout,
    } = this.props;

    const menu = (
      <Menu>
        <Menu.Item onClick={Logout}>
          <Icon type="logout" />退出
        </Menu.Item>
      </Menu>
    );

    return (
      <Layout>
        <Sider className="layout-side">
          sider
          <Menu theme="dark" mode="inline">
            <Menu.Item key="1">
              <Link to="/">
                <Icon type="user" />
                <span>首页</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/file?path=%2F">
                <Icon type="file" />
                <span>文件系统</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header className="layout-head">
            <div className="head-content">
              <Dropdown overlay={menu}>
                <a className="u-logout ant-dropdown-link" href="javascript://">
                  {userName && userName} <Icon type="down" />
                </a>
              </Dropdown>
            </div>
          </Header>
          <Content className="layout-content">
            {this.props.children}
            {windowOpen && <WindowOpen error={errMsg} />}
            {messageOpen && <MessageOpen doneMsg={doneMsg} />}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

module.exports = connect(
  state => ({
    home: state.home,
    user: state.user
  }),
  dispatch => bindActionCreators(userAction, dispatch)
)(Main);
