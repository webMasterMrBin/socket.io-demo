import PropTypes from "prop-types";
import { Close } from "./icon";
import { connect } from "react-redux";
import classNames from "classnames";
import { Button } from "antd";

// 接口报错提示的弹窗组件和弹窗确认的组件
class WindowOpen extends React.Component {
  state = {
    hide: false
  };

  static defaultProps = {
    confirm: false // confirm为true  则是弹窗确认组件
  };

  closeWindow = () => {
    const { dispatch } = this.props;
    setTimeout(() => {
      dispatch({
        type: "WINDOW_CLOSE",
        windowOpen: false
      });
    }, 200);
    this.setState({
      hide: true
    });
  };

  render() {
    const { error, confirm, confirmMsg, confirmFunc } = this.props;

    const modalClass = classNames({
      modal: true,
      "animate-hidden": this.state.hide
    });

    if (confirm) {
      return (
        <div className="u-window">
          <div className="cover" />
          <div className={modalClass}>
            <div onClick={this.closeWindow} className="btn-close">
              <svg className="icon icon-close" viewBox="0 0 32 32">
                <Close />
              </svg>
            </div>
            <div className="confirm-msg">
              {confirmMsg}
            </div>
            <div className="confirm-box">
              <Button type="dashed" className="u-button" onClick={confirmFunc}>确认</Button>
              <Button type="primary" onClick={this.closeWindow}>取消</Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="u-window">
        <div className="cover" />
        <div className={modalClass}>
          <div onClick={this.closeWindow} className="btn-close">
            <svg className="icon icon-close" viewBox="0 0 32 32">
              <Close />
            </svg>
          </div>
          {error && error}
        </div>
      </div>
    );
  }
}

WindowOpen.propTypes = {
  error: PropTypes.string, // 父组件的错误信息
  confirm: PropTypes.bool,
  confirmMsg: PropTypes.string, // 提示信息
  confirmFunc: PropTypes.func
};

module.exports = connect(
  state => ({
    home: state.home
  })
)(WindowOpen);
