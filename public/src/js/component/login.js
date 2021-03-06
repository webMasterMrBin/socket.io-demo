import { Field, reduxForm, SubmissionError } from 'redux-form';
import { InputField } from './public';
import { Tabs, Tooltip, Input } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userAction from '../action/user';
import WindowOpen from './public/windowOpen';
import MessageOpen from './public/messageOpen';
import { NAME_LIMIT } from './public/regexp';
import { Github } from './public/icon';
import gitToken from 'gitToken';

const { TabPane } = Tabs;
const { CLIENT_ID, AUTH_URL } = gitToken;

const validate = values => {
  const error = {};
  if (!values.userName) {
    error.userName = '请输入用户名';
  } else if (!NAME_LIMIT.test(values.userName)) {
    error.userName = '用户名1-6位英文或数字';
  }

  if (!values.userPwd) {
    error.userPwd = '请输入密码';
  } else if (!NAME_LIMIT.test(values.userPwd)) {
    error.userPwd = '密码1-6位英文或数字';
  }

  return error;
};

let Login = class Login extends React.Component {
  submit = v => {
    const { Login } = this.props;
    return Login(v).then(data => {
      if (data.status === 0) {
        throw new SubmissionError({
          userName: '用户名或密码不正确, 请重试',
          _error: '登录失败',
        });
      }
    });
  };

  render() {
    const { handleSubmit, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit(this.submit)}>
        <Field
          placeholder="请输入用户名"
          name="userName"
          component={InputField}
          AntdComponent={Input}
        />
        <Field
          type="password"
          placeholder="请输入密码"
          name="userPwd"
          component={InputField}
          AntdComponent={Input}
        />
        <button
          disabled={submitting}
          type="submit"
          className="ant-btn ant-btn-primary login-btn"
        >
          登录
        </button>
      </form>
    );
  }
};

let Logup = class Logup extends React.Component {
  submit = v => {
    const { Register } = this.props;
    return Register(v).then(data => {
      if (data.status === 0) {
        throw new SubmissionError({
          userName: '用户名已存在, 请重试',
          _error: '注册失败',
        });
      }
    });
  };

  render() {
    const { handleSubmit, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit(this.submit)}>
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
      </form>
    );
  }
};

Login = connect(
  state => ({
    user: state.user,
  }),
  dispatch => bindActionCreators(userAction, dispatch)
)(Login);

Login = reduxForm({
  form: 'user_login',
  validate,
})(Login);

Logup = connect(
  state => ({
    user: state.user,
  }),
  dispatch => bindActionCreators(userAction, dispatch)
)(Logup);

Logup = reduxForm({
  form: 'user_register',
  validate,
})(Logup);

class Index extends React.Component {
  render() {
    const {
      home: { windowOpen, errMsg, messageOpen, doneMsg },
    } = this.props;

    return (
      <div className="login-box">
        <div className="login-main">
          <Tabs defaultActiveKey="1" animated={false}>
            <TabPane tab="登录" key="1">
              <Login />
            </TabPane>
            <TabPane tab="注册" key="2">
              <Logup />
            </TabPane>
          </Tabs>
        </div>
        <Tooltip title="Git登录">
          <a href={`${AUTH_URL}?client_id=${CLIENT_ID}`}>
            <svg className="git-icon" viewBox="0 0 16 16">
              <Github />
            </svg>
          </a>
        </Tooltip>
        {windowOpen && <WindowOpen error={errMsg} />}
        {messageOpen && <MessageOpen doneMsg={doneMsg} />}
      </div>
    );
  }
}

module.exports = connect(state => ({
  home: state.home,
}))(Index);
