import { Tree, Upload, Button, Icon } from 'antd';
import connect from 'bin-react-redux-connect';
import MessageOpenComponent from '../public/messageOpen';
import * as ajax from 'action/lib/ajax';

const { TreeNode } = Tree;

/*[
  {
    title: '一级菜单',
    key: '0-0',
    children: [{
      title: '二级菜单',
      key: '0-0-0',
      page: 'index.html',
    }],
  },
]*/

function renderTreeNode(arr) {
  return arr.map(o => {
    if (o.children) {
      return (
        <TreeNode title={o.title} key={o.key}>
          {renderTreeNode(o.children)}
        </TreeNode>
      );
    }
    return <TreeNode title={o.title} key={o.key} />;
  });
}

function findKey(selectedKeys, info, treeList, setState) {
  const result = treeList.find(o => o.children[0].key === selectedKeys[0]);
  console.log('result', result);
  setState(result.title);
}

const MockupLeft = props => {
  const { setState, treeList } = props;
  return (
    <div className="mockup-left">
      <Tree
        onSelect={(selectedKeys, info) =>
          findKey(selectedKeys, info, treeList, setState)
        }
      >
        {renderTreeNode(props.treeList)}
      </Tree>
    </div>
  );
};

class Index extends React.Component {
  componentDidMount() {
    const { TreeList } = this.props;
    TreeList();
  }

  state = {
    title: '',
  };

  render() {
    const {
      MessageOpen,
      Unzlib,
      home: { messageOpen, doneMsg },
      mockup: { treeList },
    } = this.props;
    console.log('state', this.state);
    const props = {
      name: 'file',
      action: '/api/mockup/upload',
      onChange(info) {
        if (_.get(info, 'file.response.msg') === '上传成功') {
          MessageOpen('上传成功');
          Unzlib(_.get(info, 'file.response.zipName'));
        }
      },
      accept: '.zip',
    };
    return (
      <div>
        {messageOpen && <MessageOpenComponent doneMsg={doneMsg} />}
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> Click to Upload
          </Button>
        </Upload>
        <div className="mockup-container">
          <MockupLeft
            treeList={treeList}
            setState={title => this.setState({ title })}
          />
          <iframe
            className="u-iframe mockup-right"
            src={`http://localhost:4000/${this.state.title}`}
          />
        </div>
      </div>
    );
  }
}

module.exports = connect(
  Index,
  ['home', 'mockup'],
  {
    MessageOpen: d => dispatch =>
      dispatch({
        type: 'MESSAGE_OPEN',
        messageOpen: true,
        doneMsg: d,
      }),
    Unzlib: zipName => {
      return dispatch =>
        ajax.post(dispatch, {
          url: '/api/mockup/unzlib',
          data: JSON.stringify({
            zipName,
          }),
        });
    },
    TreeList: () => dispatch =>
      ajax.get(dispatch, {
        url: '/api/mockup/getFileTree',
        success(d) {
          dispatch({
            type: 'MOCKUP_LIST',
            list: d,
          });
        },
      }),
  }
);
