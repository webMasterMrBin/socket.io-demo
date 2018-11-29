import { Warn } from './icon';
import PropTypes from 'prop-types';

const ValidateTip = props => (
  <div className="validate-tip">
    <svg className="icon icon-warn" viewBox="0 0 32 32">
      <Warn />
    </svg>
    {props.error}
  </div>
);

ValidateTip.propTypes = {
  error: PropTypes.string,
};

// NOTE HOC 接受antd的一个表单组件 包装成redux-form需要的组件
const InputField = props => {
  const {
    input,
    meta: { error, touched },
    AntdComponent,
  } = props;
  const otherProps = _.omit(props, ['input', 'meta', 'AntdComponent']);
  return (
    <div className="input-box" style={{ width: otherProps.width || '100%' }}>
      <AntdComponent className="input-field" {...otherProps} {...input} />
      {touched && error ? <ValidateTip error={error} /> : ''}
    </div>
  );
};

InputField.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  AntdComponent: PropTypes.func,
};

export { InputField };
