import PropTypes from "prop-types";
import { Close } from "./icon";
import { connect } from "react-redux";
import classNames from "classnames";

// 接口报错提示的弹窗组件
class WindowOpen extends React.Component {
  state = {
    hide: false
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
    const { error } = this.props;

    const modalClass = classNames({
      modal: true,
      "animate-hidden": this.state.hide
    });

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
  error: PropTypes.string // 父组件的错误信息
};

module.exports = connect(
  state => ({
    home: state.home
  })
)(WindowOpen);
