import { Field, reduxForm, SubmissionError, destroy } from "redux-form";
import { InputField } from "./public";
import { Button, Input, Tabs } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userAction from "../action/user";
import WindowOpen from "./public/windowOpen";
import MessageOpen from "./public/messageOpen";

const { TabPane } = Tabs;

const validate = values => {
  const error = {};
  if (!values.userName) {
    error.userName = "请输入用户名";
  }

  if (!values.userPwd) {
    error.userPwd = "请输入密码";
  }

  return error;
};

class Login extends React.Component {
  state = {
    loginState: true, // 判断是登录还是注册 true则为登录登录逻辑
    tabKey: "1"
  };

  changeLoginState = e => {
    this.setState({
      loginState: !this.state.loginState,
      tabKey: e
    });
  };

  submit = v => {
    const { Register, Login, dispatch } = this.props;
    if (this.state.loginState) {
      return Login(v);
    } else {
      return Register(v).then(data => {
        if (data.includes("注册失败")) {
          throw new SubmissionError({
            userName: "用户名已存在, 请重试",
            _error: "注册失败"
          });
        } else {
          // 注册成功 是否清空表单字段
          this.setState(
            () => ({
              tabKey: "1"
            }),
            // () => dispatch(destroy("user_login"))
          );
        }
      });
    }
  };

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit(this.submit)}>
        <Tabs
          defaultActiveKey={this.state.tabKey}
          activeKey={this.state.tabKey}
          onChange={this.changeLoginState}
          animated={false}
        >
          <TabPane tab="登录" key="1">
            <Field
              placeholder="请输入用户名"
              name="userName"
              component={InputField}
            />
            <Field
              type="password"
              placeholder="请输入密码"
              name="userPwd"
              component={InputField}
            />
            <button
              disabled={submitting}
              type="submit"
              className="ant-btn ant-btn-primary login-btn"
            >
              登录
            </button>
          </TabPane>
          <TabPane tab="注册" key="2">
            <Field
              placeholder="请输入用户名"
              name="userName"
              component={InputField}
            />
            <Field
              type="password"
              placeholder="请输入密码"
              name="userPwd"
              component={InputField}
            />
            <button
              disabled={submitting}
              type="submit"
              className="ant-btn ant-btn-primary login-btn"
            >
              注册
            </button>
          </TabPane>
        </Tabs>
      </form>
    );
  }
}

Login = connect(
  state => {
    user: state.user
  },
  dispatch => bindActionCreators(userAction, dispatch)
)(Login);

Login = reduxForm({
  form: "user_login",
  validate
})(Login);

class Index extends React.Component {
  render() {
    const { home: { windowOpen, errMsg, messageOpen, doneMsg } } = this.props;
    return (
      <div className="login-box">
        <Login />
        {windowOpen && <WindowOpen error={errMsg} />}
        {messageOpen && <MessageOpen doneMsg={doneMsg} />}
      </div>
    );
  }
}

module.exports = connect(
  state => ({
    home: state.home
  })
)(Index);
