import { List } from "../action";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as action from "../action";

class Login extends React.Component {
  // XXX 直接连接 redux的store
  // dispatch = () => {
  //   const { store } = this.props;
  //   store.dispatch(List('发出请求','收到请求'));
  // }

  render() {
    console.log("this.props", this.props);
    return (
      <div>
        <button onClick={() => this.props.List("发出请求", "收到请求")}>
          点我
        </button>
      </div>
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

// XXX 子组件通过 Provider context 拿到store
// Login.contextTypes = {
//   store: PropTypes.object
// };

module.exports = Login;
