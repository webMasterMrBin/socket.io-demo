import { Progress, Icon } from "antd";
import classNames from "classnames";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class ProgressControl extends React.Component {
  state = {
    minus: false
  };

  close = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "PROGRESS_CLOSE",
      progressOpen: false
    });
  }

  minus = () => {
    this.setState({
      minus: !this.state.minus
    });
  };

  render() {
    const { fileProgress } = this.props;

    const status = classNames({
      "u-progress": true,
      minus: this.state.minus
    });

    return (
      <div className={status}>
        <div className="btn-group">
          <Icon type="close" onClick={this.close} />
          <Icon
            type={this.state.minus ? "plus" : "minus"}
            onClick={this.minus}
          />
        </div>
        {_.map(fileProgress, (o, i) => (
          <div key={i} style={{ width: "100%", marginBottom: "10px" }}>
            <Icon type="file" />
            <span>{o.fileName}</span>
            <Progress percent={o.percent} status="active" />
          </div>
        ))}
      </div>
    );
  }
}

ProgressControl.propTypes = {
  fileProgress: PropTypes.array
};

module.exports = connect()(ProgressControl);
