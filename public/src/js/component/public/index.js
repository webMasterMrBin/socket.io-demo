import { Input } from "antd";
import { Warn } from "./icon";

const ValidateTip = props => (
  <div className="validate-tip">
    <svg className="icon icon-warn" viewBox="0 0 32 32">
      <Warn />
    </svg>
    {props.error}
  </div>
)

const InputField = props => {
  const {
    input,
    meta: { error, touched }
  } = props;
  const otherProps = _.omit(props, ["input", "meta"]);
  return (
    <div className="input-box" style={{ width: otherProps.width || "100%" }}>
      <Input className="input-field" {...otherProps} {...input} />
      {touched && error ? <ValidateTip error={error} /> : ""}
    </div>
  );
}

export { InputField };
