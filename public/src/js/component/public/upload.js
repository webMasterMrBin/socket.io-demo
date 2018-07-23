import { Button, Icon, Dropdown, Menu } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import * as uploadAction from "action/file";

// 文件上传组件
class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.file = React.createRef();
    this.directory = React.createRef();
  }

  // 上传文件夹
  onDirChange = () => {
    const { Upload, location: { query: { path } } } = this.props;
    const formData = new FormData();
    formData.append("uploadWay", "directory");
    _.forEach(this.directory.current.files, (o, i) => {
      console.log("o", o);
      formData.append(`file${i}`, o);
      formData.append(`file${i}-path`, o.webkitRelativePath);
    });
    Upload(formData, path);
  };

  onChange = () => {
    const { Upload, location: { query: { path } } } = this.props;
    const formData = new FormData();
    formData.append("file", this.file.current.files[0]);
    Upload(formData, path);
    console.log("file", this.file.current.files);
  };

  menu = () => {
    const {
      progress: { percent },
      http: { loading }
    } = this.props;
    return (
      <Menu>
        <Menu.Item onClick={() => this.file.current.click()}>
          <Icon type="file-add" /> 选择文件
        </Menu.Item>
        <Menu.Item
          disabled={loading && percent !== 100}
          onClick={() => this.directory.current.click()}
        >
          <Icon type="folder-add" /> 选择文件夹
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    return (
      <div className="u-upload">
        <input
          style={{ display: "none" }}
          type="file"
          ref={this.file}
          onChange={this.onChange}
        />
        <input
          ref={this.directory}
          style={{ display: "none" }}
          type="file"
          multiple="true"
          webkitdirectory="true"
          directory="true"
          onChange={this.onDirChange}
        />
        <Dropdown overlay={this.menu()}>
          <Button>
            <Icon type="upload" />
            上传文件
          </Button>
        </Dropdown>
      </div>
    );
  }
}

module.exports = withRouter(connect(
  state => ({
    home: state.home,
    progress: state.progress,
    http: state.http
  }),
  dispatch => bindActionCreators(uploadAction, dispatch)
)(FileUpload));
