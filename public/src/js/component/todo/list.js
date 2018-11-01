import PropTypes from 'prop-types';
import connect from 'bin-react-redux-connect';
import * as todoAction from 'action/todo';
import { Checkbox, Button, Input } from 'antd';

// 每个代办任务
const Item = props => {
  const { data } = props;
  return (
    <div className="todo-item">
      <div>
        <Checkbox />
      </div>
      <div className="todo-item-content">{data.text}</div>
      <div className="todo-item-action">
        <span>删除</span>
        <span>编辑</span>
      </div>
    </div>
  );
};

class Index extends React.Component {
  static propTypes = {
    todo: PropTypes.object,
    Addtodo: PropTypes.func,
  };

  state = {
    task: '',
  };

  save = () => {
    const { todo: todoAll } = this.props;
    window.localStorage.setItem('todo', JSON.stringify(todoAll));
  };

  render() {
    const {
      todo: { todoAll },
      Addtodo,
    } = this.props;
    return (
      <div>
        {todoAll.map((o, i) => <Item key={i} data={o} />)}
        <div style={{ display: 'flex' }}>
          <Input
            placeholder="你想干嘛"
            onChange={e => this.setState({ task: e.target.value })}
            onPressEnter={e => Addtodo(e.target.value)}
          />
          <Button onClick={() => Addtodo(this.state.task)}>增加任务</Button>
          <Button onClick={this.save}>保存记录</Button>
        </div>
      </div>
    );
  }
}

export default connect(Index, ['todo'], todoAction);
