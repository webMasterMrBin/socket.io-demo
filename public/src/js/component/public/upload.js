import { Button, Icon, Dropdown, Menu } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as uploadAction from "action/file";

// 文件上传组件
class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.file = React.createRef();
    this.directory = React.createRef();
  }

  onChange = () => {
    const { Upload } = this.props;
    const formData = new FormData();
    formData.append("file", this.file.current.files[0]);
    Upload(formData);
    console.log("files", this.file.current.files);
  };

  menu = () => {
    return (
      <Menu>
        <Menu.Item onClick={() => this.file.current.click()}>
          选择文件
        </Menu.Item>
        <Menu.Item onClick={() => this.directory.current.click()}>
          选择文件夹
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    return (
      <div>
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
          webkitdirectory="true"
          directory="true"
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



module.exports = connect(
  state => ({
    home: state.home
  }),
  dispatch => bindActionCreators(uploadAction, dispatch)
)(FileUpload);
