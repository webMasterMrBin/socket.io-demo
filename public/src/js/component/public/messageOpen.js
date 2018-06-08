import { connect } from "react-redux";
import PropTypes from "prop-types";
import classNames from "classnames";

class MessageOpen extends React.Component {
  state = {
    hide: false
  };

  componentDidMount() {
    const { dispatch } = this.props;
    setTimeout(() => {
      // 异步1 setState  自带callback的 写法在 动画结束隐藏MessageOpen组件
      this.setState(() => {
          return {
            hide: true
          };
        },
        () => {
          setTimeout(() => {
            dispatch({
              type: "MESSAGE_CLOSE",
              messageOpen: false
            });
          }, 500); // 等动画时间执行完在关闭
        }
      );
    }, 1000);

    // 异步二 async写法
    // (async () => {
    //   await new Promise(resolve => {
    //     setTimeout(() => {
    //       resolve(this.setState({ hide: true }));
    //     }, 1000);
    //   });
    //   console.log("hide", this.state.hide);
    //   setTimeout(() => {
    //     dispatch({
    //       type: "MESSAGE_CLOSE",
    //       messageOpen: false
    //     });
    //   }, 500);
    // })();
  }

  render() {
    const { home: { messageOpen }, doneMsg } = this.props;

    const messageClass = classNames({
      "u-message": true,
      "message-open": this.state.hide
    });

    return <div className={messageClass}>{doneMsg && doneMsg}</div>;
  }
}

MessageOpen.propTypes = {
  doneMsg: PropTypes.string
};

module.exports = connect(
  state => ({
    home: state.home
  })
)(MessageOpen);
