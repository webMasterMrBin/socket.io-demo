import PropTypes from 'prop-types';
import { Icon } from 'antd';

class PreView extends React.Component {
  state = {
    loading: true
  };

  static propTypes = {
    PreviewClose: PropTypes.func,
    fileName: PropTypes.string,
    preType: PropTypes.string
  };

  render() {
    const { PreviewClose, fileName, preType } = this.props;
    return (
      <div className="u-preview">
        <div className="btn-close" onClick={PreviewClose}>
          <Icon type="close" style={{ fontSize: '32px' }} />
        </div>
        {this.state.loading && (
          <Icon
            type="loading"
            className="preview-img"
            style={{ color: 'red', width: '50px', height: '50px' }}
          />
        )}
        <img
          className="preview-img"
          onLoad={() => this.setState({ loading: false })}
          src={`${
            window.origin
          }/api/readImage?fileName=${fileName}&preType=${preType}`}
          alt="加载失败"
        />
      </div>
    );
  }
}

export default PreView;
