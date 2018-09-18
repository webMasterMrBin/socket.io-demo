import { Icon, Button, Breadcrumb, Table, Tooltip, Input } from "antd";
import { browserHistory, withRouter, Link } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as uploadAction from "action/file";
import FileUpload from "../public/upload";

class File extends React.Component {
  constructor(props) {
    super(props);
    const {
      location: {
        query: { path }
      }
    } = this.props;

    this.state = {
      downPath: "", // 下载路径
      dataSource: [],
      directoryName: "",
      url: {
        pathname: "/file",
        query: { path: "" }
      },
      path // 文件的webkitRelativePath路径
    };
  }

  componentDidMount() {
    const {
      ListFiles,
      location: {
        query: { path }
      }
    } = this.props;
    ListFiles(path);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      location: {
        query: { path }
      },
      ListFiles
    } = nextProps;
    if (path !== prevState.path) {
      // 点击目录url更改了
      ListFiles(path);
    }
    return {
      path
    };
  }

  bytes = v => {
    if (v >= 1024 * 1024) {
      return `${(v / 1024 / 1024).toFixed(2)}M`;
    }

    return `${(v / 1024).toFixed(2)}kb`;
  };

  // 显示文件type logo
  displayLogo = record => {
    if (record.isDir) {
      return "folder";
    }
    return "file";
  };

  // 删文件和文件夹
  remove = (record, webkitRelativePath, filePath) => {
    const { WindowOpenConfirm, RemoveDir, RemoveFile } = this.props;
    WindowOpenConfirm(
      record.isDir === 1
        ? `确认删除文件夹${record.name}下的所有文件?`
        : `确认删除文件${record.name}`,
      () => {
        if (record.isDir) {
          // 删目录
          RemoveDir(record.name, webkitRelativePath);
        } else {
          // 删文件
          RemoveFile(filePath, record.name, webkitRelativePath);
        }
      }
    );
  };

  columns = () => {
    const {
      file: { files },
      CreateDir,
      location: {
        query: { path }
      }
    } = this.props;
    return [
      {
        title: "文件名",
        key: "name",
        dataIndex: "name",
        width: 300,
        render: (text, record) => {
          if (record.createDir) {
            return (
              <div className="file-name folder-name">
                <Icon type="folder" />
                <Input
                  onChange={e =>
                    this.setState({ directoryName: e.target.value })
                  }
                  className="folder-input"
                  size="small"
                />
                <a
                  onClick={() =>
                    CreateDir({
                      directoryName: this.state.directoryName,
                      webkitRelativePath: path
                    }).then(d => {
                      if (d) {
                        this.setState({
                          dataSource: []
                        });
                      }
                    })
                  }
                >
                  <Icon type="check" />
                </a>
                <a>
                  <Icon
                    type="close"
                    onClick={() => this.setState({ dataSource: [] })}
                  />
                </a>
              </div>
            );
          }
          return (
            <div className="file-name">
              <Icon type={this.displayLogo(record)} />
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
          const filePath = _.get(files[record.key], "path");
          const webkitRelativePath = _.get(
            files[record.key],
            "webkitRelativePath"
          );
          return (
            <div>
              {/*<Tooltip title="下载">
                <a
                  onClick={() =>
                    this.setState({
                      downPath: `${DEV_URL}/api/downloadFile?filePath=${filePath}&name=${
                        record.name
                      }&diffIframe=${Math.random()}`
                    })
                  }
                  style={{ marginRight: "10px" }}
                >
                  <Icon type="download" />
                </a>
              </Tooltip>*/}
              <Tooltip title="删除">
                <a
                  onClick={() =>
                    this.remove(record, webkitRelativePath, filePath)
                  }
                >
                  <Icon type="delete" />
                </a>
              </Tooltip>
            </div>
          );
        }
      }
    ];
  };

  // 新建文件夹
  createDirector = dataSource => {
    dataSource.push({
      key: dataSource[dataSource.length - 1].key + 1,
      name: "新建文件夹",
      size: "-",
      modifiedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      isDir: 1,
      createDir: 1
    });
    this.setState({
      dataSource
    });
  };

  render() {
    const {
      file: { files, uploadChunks, fileExis, fileBroken },
      http: { loading },
      location: {
        query: { path }
      }
    } = this.props;
    const dataSource = [];
    const pathArr = path.split("/").slice(1);
    let sum = "";
    const breadUrl = [];
    // 加载状态
    const loadState = !_.isEmpty(loading)
      ? loading[Object.keys(loading).find(o => o.includes("/api/files"))]
      : false;
    // 文件上传
    const uploadState = !_.isEmpty(loading)
      ? loading[Object.keys(loading).find(o => o.includes("/api/upload"))]
      : false;

    if (!_.isEmpty(files)) {
      _.forEach(files, (o, i) => {
        dataSource.push({
          key: i,
          name: o.fileName,
          size: o.size ? this.bytes(o.size) : "-",
          modifiedDate: moment(o.modifiedDate).format("YYYY-MM-DD HH:mm:ss"),
          isDir: o.isDir,
          type: o.type
        });
      });
    }

    return (
      <div className="file-system">
        <div className="button-group">
          <FileUpload
            uploadChunks={uploadChunks}
            fileExis={fileExis}
            fileBroken={fileBroken}
          />
          <Button
            disabled={!_.isEmpty(this.state.dataSource)}
            onClick={() => this.createDirector(dataSource)}
            className="create-dir"
          >
            <Icon type="folder-add" />新建文件夹
          </Button>
        </div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a>
              <Link to="http://localhost:4000/file?path=/">全部文件</Link>
            </a>
          </Breadcrumb.Item>
          {pathArr.map((o, i) => {
            sum += `/${o}`;
            // breadUrl [1,2,3] 返回 [1, 3, 6]
            breadUrl.push(sum);
            return (
              <Breadcrumb.Item key={i}>
                <a>
                  <Link to={`http://localhost:4000/file?path=${breadUrl[i]}`}>
                    {o}
                  </Link>
                </a>
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
        <iframe src={this.state.downPath} style={{ display: "none" }} />
        <Table
          className="file-table"
          columns={this.columns()}
          dataSource={
            this.state.dataSource.length === 0
              ? dataSource
              : this.state.dataSource
          }
          loading={loadState || uploadState}
          onRow={record => {
            return {
              onClick: () => console.log("record", record),
              onDoubleClick: () => {
                if (record.isDir) {
                  browserHistory.replace(
                    `${location.href}${
                      location.href.split("")[location.href.length - 1] === "/"
                        ? ""
                        : "/"
                    }${record.name}`
                  );
                }
              }
            };
          }}
        />
      </div>
    );
  }
}

module.exports = withRouter(
  connect(
    state => ({
      home: state.home,
      file: state.file,
      http: state.http
    }),
    dispatch => bindActionCreators(uploadAction, dispatch)
  )(File)
);
