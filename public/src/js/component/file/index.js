import { Icon, List, Button, Breadcrumb, Table, Tooltip } from "antd";
import { browserHistory, withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as uploadAction from "action/file";
import FileUpload from "../public/upload";

const columns = [
  {
    title: "文件名",
    key: "name",
    dataIndex: "name",
    render: (text, record) => {
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
    render: () => (
      <div>
        <Tooltip title="下载">
          <a><Icon type="download"/></a>
        </Tooltip>
        <Tooltip title="删除">
          <a><Icon type="delete"/></a>
        </Tooltip>
      </div>
    )
  }
];

class File extends React.Component {
  state = {
    loading: false,
    dataSource: [] //table的数据
  };

  componentDidMount() {
    const { ListFiles } = this.props;
    ListFiles();
  }

  bytes = v => {
    if (v >= 1024 * 1024) {
      return `${parseFloat(v / 1024 / 1024)}M`;
    }

    return `${parseFloat(v / 1024)}kb`;
  }

  render() {
    const { file: { files } } = this.props;
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
        <Table
          className="file-table"
          columns={columns}
          dataSource={dataSource}
          loading={_.isEmpty(files)}
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
    file: state.file
  }),
  dispatch => bindActionCreators(uploadAction, dispatch)
)(File);
