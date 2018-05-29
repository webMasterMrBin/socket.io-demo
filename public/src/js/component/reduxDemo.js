import { List } from "../action";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as action from "../action";
import { reduxForm, Field, stopSubmit, destroy } from "redux-form";
import { InputField } from "./public";

const validate = values => {
  const error = {};
  if (!values.uname) {
    error.uname = "uname为空"
  }

  return error;
}

class Login extends React.Component {
  // XXX 直接连接 redux的store
  // dispatch = () => {
  //   const { store } = this.props;
  //   store.dispatch(List('发出请求','收到请求'));
  // }

  render() {
    // console.log("this.props", this.props);
    const { handleSubmit, dispatch } = this.props;
    return (
      <form onSubmit={handleSubmit(v => this.props.dispatch(stopSubmit("test_login", validate(v))))}>
        <Field width="50%" normalize={v => v.toUpperCase()} name="uname" component={InputField} type="text" />
        <Field name="pwd" component="input" type="text" />
        <button type="submit">提交</button>
        <button type="button" onClick={() => this.props.List("发出请求", "收到请求")}>
          点我
        </button>
        <button onClick={() => dispatch(destroy("test_login"))}>清空表单所有值</button>
      </form>
    );
  }
}


Login = connect(
  state => {
    return {
      rootReducer: state.rootReducer
    };
  },
  // 自定义映射的dispatch action的方法, 则在组件中没有distach 方法 👇即绑定了clickMe方法
  // dispatch => {
  //   return {
  //     clickMe: () => dispatch(List("发出请求", "收到请求"))
  //   };
  // }
  // 用bindActionCreators 绑定action 后, 和action creator定义的名字相同 不用像上面👆那样给某一个方法映射名字
  // bindActionCreators应该绑定方法集合的对象
  dispatch => bindActionCreators(action, dispatch)
)(Login);

Login = reduxForm({
  form: "test_login",
  validate,
  initialValues: {
    uname: "tom",
    pwd: 123
  },
  destroyOnUnmount: false, // 表单unmount卸载时保存状态 not destroy
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Login);

// XXX 子组件通过 Provider context 拿到store
// Login.contextTypes = {
//   store: PropTypes.object
// };

class Index extends React.Component {
  state = {
    show: true
  };

  render() {
    return (
      <div>
        {this.state.show && <Login />}
        <button onClick={() => this.setState({ show: !this.state.show })}>
          隐藏输入表单
        </button>
      </div>
    );
  }
}

module.exports = Index;
