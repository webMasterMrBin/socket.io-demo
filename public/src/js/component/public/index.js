import { Input } from "antd";

const ValidateTip = props => <div className="validate-tip">{props.error}</div>

class InputField extends React.Component {
  render() {
    const { input, meta } = this.props;
    const otherProps = _.omit(this.props, ["input", "meta"]);

    return (
      <div style={{ width: otherProps.width || "100%" }}>
        <Input {...otherProps} {...input} />
        {meta.error ? <ValidateTip error={meta.error} /> : ""}
      </div>
    );
  }
}

export { InputField };
