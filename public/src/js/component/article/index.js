import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { Fuck } from 'graphql/article/query.gql';
import { Input, Button } from 'antd';

// NOTE ES7 装饰器特性 Index = compose()(Index) Index must me a Class
@compose(
  graphql(
    Fuck,
    { name: 'fuck' },
    {
      options: props => {
        console.log('props', props);
        return {
          variables: {
            cid: 2,
          },
        };
      },
    }
  ),
  connect(state => state, () => ({}))
)
class Index extends React.Component {
  state = {
    content: '', // 上传的文章内容
  };

  submit = () => {
    console.log('content', this.state.content);
  };

  render() {
    console.log('this.props', this.props);
    return (
      <div>
        <Input.TextArea
          autosize={{ minRows: 6, maxRows: 10 }}
          defaultValue="输入文章内容"
          onChange={e => this.setState({ content: e.target.value })}
        />
        <Button onClick={this.submit}>上传</Button>
      </div>
    );
  }
}

module.exports = Index;
