import connect from 'bin-react-redux-connect';
import WindowOpen from './windowOpen';
import MessageOpen from './messageOpen';
import * as userAction from 'action/user';
import { Layout, Menu, Icon, Dropdown } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import ProgressControl from './progress';
import SIDE from './side';
const { Header, Sider, Content } = Layout;

class Main extends React.Component {
  componentDidMount() {
    const { GetUser } = this.props;
    GetUser();
  }

  render() {
    const {
      home: {
        windowOpen,
        errMsg,
        messageOpen,
        doneMsg,
        confirm,
        confirmMsg,
        confirmFunc
      },
      user: { userName },
      Logout,
      progress: { progressOpen, fileProgress }
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
            {SIDE.map(o => (
              <Menu.Item key={o.key}>
                <Link to={o.url}>
                  <Icon type="user" />
                  <span>{o.name}</span>
                </Link>
              </Menu.Item>
            ))}
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
            {windowOpen && (
              <WindowOpen
                error={errMsg}
                confirm={confirm}
                confirmMsg={confirmMsg}
                confirmFunc={confirmFunc}
              />
            )}
            {messageOpen && <MessageOpen doneMsg={doneMsg} />}
            {progressOpen && <ProgressControl fileProgress={fileProgress} />}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

Main.propTypes = {
  home: PropTypes.object,
  user: PropTypes.object,
  progress: PropTypes.object,
  Logout: PropTypes.func,
  children: PropTypes.element.isRequired,
  GetUser: PropTypes.func
};

module.exports = connect(Main, ['home', 'user', 'progress'], userAction);
