import { Button, Icon, Dropdown, Menu } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import * as uploadAction from "action/file";
const browserMD5File = require("browser-md5-file");

// 文件上传组件(分片上传, 断点续传)
class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.file = React.createRef();
    this.directory = React.createRef();
    this.state = {
      chooseFile: false, // 是否选择文件
      fileName: "", // 选择的文件名字
      loadingMd5: false, // md5检验状态
      md5: ""
    };
  }

  // 上传文件夹
  onDirChange = () => {
    const {
      Upload,
      location: {
        query: { path }
      }
    } = this.props;
    const formData = new FormData();
    formData.append("uploadWay", "directory");
    _.forEach(this.directory.current.files, (o, i) => {
      console.log("o", o);
      formData.append(`file${i}`, o);
      formData.append(`file${i}-path`, o.webkitRelativePath);
    });
    Upload(formData, path);
  };

  uploadChunk = props => {
    const {
      chunks,
      i,
      chunkSize,
      file,
      formData,
      fileName,
      size,
      webkitRelativePath,
      type
    } = props;
    formData.append("total", chunks); // 总片数
    formData.append("index", i); // 当前的是第几片
    formData.append("md5", this.state.md5);
    fileName && formData.append("fileName", fileName); // 文件名字
    size && formData.append("size", size);
    webkitRelativePath &&
      formData.append("webkitRelativePath", webkitRelativePath);
    type && formData.append("type", type);
    // 要把文件对象放在最后append 否则 multer插件自定义文件名字时 req.body为{}
    formData.append("file", file.slice(chunkSize * i, chunkSize * (i + 1)));
  };

  checkAndUploadChunk = () => {
    // 点击按钮上传
    const {
      Upload,
      MergeFile,
      location: {
        query: { path }
      },
      uploadChunks,
      fileExis,
      fileBroken,
      ProgressOpen,
      ProgressIncrease
    } = this.props;
    const file = this.file.current.files[0];
    const chunkSize = 5 * 1024 * 1024; // 每次上传10MB
    // 上传的总的文件大小
    const fileSize = file.size;
    // 一共上传的请求次数
    const chunks = Math.ceil(fileSize / chunkSize);
    if (!fileExis) {
      if (fileSize <= chunkSize) {
        const formData = new FormData();
        // 文件大小小于chunksize 则只发一次请求且不用合并文件
        this.uploadChunk({
          chunks,
          i: 0,
          chunkSize,
          file,
          formData,
          fileName: file.name,
          size: file.size,
          type: file.type,
          webkitRelativePath: path
        });
        Upload(formData, path);
      } else {
        // file.slice(start, end)
        (async () => {
          if (!_.isEmpty(uploadChunks)) {
            // 存在已经上传的chunks(续传)
            // 已经上传的chunks
            // TODO 增加一个按钮, 点击暂停下载进度, 再次点击续传
            const uploaded = uploadChunks.map(o => parseFloat(o.split("-")[0]));

            const totalChunks = [];
            for (let i = 0; i < chunks; i++) {
              totalChunks.push(i);
            }

            // 找到还没上传的chunks
            const readyToChunks = totalChunks.filter(
              o => !uploaded.includes(o)
            );

            if (fileBroken) {
              readyToChunks.unshift(
                parseFloat(uploadChunks[uploadChunks.length - 1].split("-")[0])
              );
            }
            // 已经上传到哪个chunk了
            let progressChunk = uploaded[uploaded.length - 1];
            ProgressOpen(
              file.name,
              Math.ceil((progressChunk + 1) / chunks * 100)
            );
            for (let i = 0; i < readyToChunks.length; i++, progressChunk++) {
              const formData = new FormData();
              this.uploadChunk({
                chunks,
                i: readyToChunks[i],
                chunkSize,
                file,
                formData
              });
              //await Upload(formData, path);
              await new Promise(resolve => {
                setTimeout(() => resolve(), 1000);
              });
              ProgressIncrease(
                Math.ceil((progressChunk + 1) / chunks * 100),
                file.name
              );
            }
          } else {
            ProgressOpen(file.name);
            // 没有上传过chunks,从头开始传
            for (let i = 0; i < chunks; i++) {
              const formData = new FormData();
              this.uploadChunk({
                chunks,
                i,
                chunkSize,
                file,
                formData
              });
              // 串行传输 所以chunks按照顺序排e.g 0-...,1-...,2-...
              await Upload(formData, path);
              ProgressIncrease(Math.ceil((i + 1) / chunks * 100), file.name);
            }
          }
          // 请求合并文件(所有的chunks都上传完)
          MergeFile({
            md5: this.state.md5,
            fileName: file.name,
            webkitRelativePath: path,
            size: file.size,
            type: file.type
          });
        })();
      }
    } else {
      // 文件已经有了(秒传)
      alert("文件已经有了(秒传)");
    }
  };

  onSubmit = () => {
    this.checkAndUploadChunk();
  };

  onChange = () => {
    const { CheckMd5 } = this.props;
    // 选择文件确认文件大小
    // 发一次请求确认该文件是否上传过，服务器有记录则实现秒传, 有部分记录则续传
    // NOTE 使用md5判断文件唯一性
    // 获取文件MD5
    // NOTE browserMD5File 在选中文件后再次选择文件时点取消 报错
    // TODO 改用原生的js-spark-md5插件 可以支持获取md5进度
    const file = this.file.current.files[0];
    this.setState(
      () => {
        return {
          loadingMd5: true,
          chooseFile: true,
          fileName: file ? file.name : ""
        };
      },
      () => {
        browserMD5File(file, (err, data) => {
          if (err) {
            this.setState({
              fileName: "获取文件md5失败, 请重试"
            });
          } else {
            CheckMd5(data, file.size).then(() => {
              this.setState({
                loadingMd5: false,
                md5: data
              });
            });
          }
        });
      }
    );
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
      <div>
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
          <Dropdown overlay={this.menu()} className="sm-btn">
            <Button>
              <Icon type="upload" />
              上传文件
            </Button>
          </Dropdown>
        </div>
        <div className="check-md5">
          {this.state.loadingMd5 && (
            <div className="loading-md5">
              校验文件MD5中
              <Icon type="loading" />
            </div>
          )}
          {this.state.fileName && (
            <div className="file-name">{this.state.fileName}</div>
          )}
          {this.state.chooseFile && (
            <Button
              className="sm-btn"
              disabled={this.state.loadingMd5}
              onClick={this.onSubmit}
            >
              上传
            </Button>
          )}
        </div>
      </div>
    );
  }
}

module.exports = withRouter(
  connect(
    state => ({
      home: state.home,
      progress: state.progress,
      http: state.http
    }),
    dispatch => bindActionCreators(uploadAction, dispatch)
  )(FileUpload)
);
