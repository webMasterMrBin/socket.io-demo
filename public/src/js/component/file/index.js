import { Icon, List, Button, Breadcrumb, Table, Tooltip } from "antd";
import { browserHistory, withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as uploadAction from "action/file";
import FileUpload from "../public/upload";

class File extends React.Component {
  state = {
    loading: false,
    downPath: "" // 下载路径
  };

  componentDidMount() {
    const { ListFiles } = this.props;
    ListFiles();
  }

  bytes = v => {
    if (v >= 1024 * 1024) {
      return `${(v / 1024 / 1024).toFixed(2)}M`;
    }

    return `${(v / 1024).toFixed(2)}kb`;
  };

  columns = () => {
    const { RemoveFile, file: { files } } = this.props;
    return [
      {
        title: "文件名",
        key: "name",
        dataIndex: "name",
        render: text => {
          return (
            <div className="file-name">
              <Icon type="picture" />
              <span className="file">{text}</span>
            </div>
          );
        }
      },
      {
        title: "大小",
        key: "size",
        dataIndex: "size"
      },
      {
        title: "修改时间",
        key: "modifiedDate",
        dataIndex: "modifiedDate"
      },
      {
        title: "操作",
        key: "action",
        dataIndex: "action",
        render: (text, record) => {
          console.log("text", text);
          console.log("record", record);
          const filePath = _.get(files[record.key], "path");
          return (
            <div>
              <Tooltip title="下载">
                <a
                  onClick={() =>
                    this.setState({
                      downPath: `/api/downloadFile?filePath=${filePath}&name=${
                        record.name
                      }`
                    })
                  }
                  style={{ marginRight: "10px" }}
                >
                  <Icon type="download" />
                </a>
              </Tooltip>
              <Tooltip title="删除">
                <a onClick={() => RemoveFile(filePath, record.name)}>
                  <Icon type="delete" />
                </a>
              </Tooltip>
            </div>
          )
        }
      }
    ];
  };

  render() {
    const {
      file: { files },
      RemoveFile,
      http: { loading }
    } = this.props;
    const dataSource = [];
    if (!_.isEmpty(files)) {
      _.forEach(files, (o, i) => {
        dataSource.push({
          key: i,
          name: o.fileName,
          size: o.size ? this.bytes(o.size) : "-",
          modifiedDate: moment(o.modifiedDate).format("YYYY-MM-DD HH:mm:ss")
        });
      });
    }

    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>全部文件</Breadcrumb.Item>
          <Breadcrumb.Item>1号</Breadcrumb.Item>
        </Breadcrumb>
        <iframe src={this.state.downPath} style={{ display: "none" }} />
        <Table
          className="file-table"
          columns={this.columns()}
          dataSource={dataSource}
          loading={_.isEmpty(files) && loading}
          onRow={(record) => {
            return {
              onClick: () => console.log("record", record)
            };
          }}
        />
        <FileUpload />
      </div>
    );
  }
}

module.exports = connect(
  state => ({
    home: state.home,
    file: state.file,
    http: state.http
  }),
  dispatch => bindActionCreators(uploadAction, dispatch)
)(File);
