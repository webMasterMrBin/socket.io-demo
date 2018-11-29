import PropTypes from 'prop-types';
import connect from 'bin-react-redux-connect';
import * as todoAction from 'action/todo';
import { Checkbox, Button, Input } from 'antd';

// 每个代办任务
class Item extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (
      nextProps.data.complete === this.props.data.complete &&
      nextProps.data.id === this.props.data.id
    ) {
      return false;
    }
    return true;
  }

  onChange = () => {
    const { data, Todochange } = this.props;
    Todochange(data.id, !data.complete);
  };

  render() {
    const { data, Deletetodo } = this.props;
    return (
      <div className="todo-item">
        <div className="todo-item-head">
          <Checkbox checked={data.complete} onChange={this.onChange} />
        </div>
        <div className="todo-item-content">{data.text}</div>
        <div className="todo-item-action">
          <span
            onClick={() => Deletetodo(data.id)}
            style={{ marginRight: '20px', cursor: 'pointer' }}
          >
            删除
          </span>
          <span style={{ cursor: 'pointer' }}>编辑</span>
        </div>
      </div>
    );
  }
}

class Index extends React.Component {
  static propTypes = {
    todo: PropTypes.object,
    Addtodo: PropTypes.func,
    Deletetodo: PropTypes.func,
    Todochange: PropTypes.func,
    type: PropTypes.string,
  };

  state = {
    task: '',
  };

  save = () => {
    const { todo: todoAll } = this.props;
    window.localStorage.setItem('todo', JSON.stringify(todoAll));
  };

  typeRender = () => {
    const {
      type,
      todo: { todoAll },
      Deletetodo,
      Todochange,
    } = this.props;
    const func = (o, i) => (
      <Item key={i} data={o} Deletetodo={Deletetodo} Todochange={Todochange} />
    );
    console.log('todoAll', todoAll);
    switch (type) {
      case 'undone':
        return todoAll.filter(o => !o.complete).map(func);
      case 'done':
        return todoAll.filter(o => o.complete).map(func);
      default:
        return todoAll.map(func);
    }
  };

  render() {
    const { Addtodo } = this.props;
    return (
      <div>
        <div className="todo-box">{this.typeRender()}</div>
        <div className="todo-container">
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
