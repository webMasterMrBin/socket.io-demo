import React from 'react';
import { mount } from 'enzyme';
// import configureStore from 'redux-mock-store';
import Todo from '../list';
// import toJson from 'enzyme-to-json';
import shortid from 'shortid';
import { Provider } from 'react-redux';
// import thunk from 'redux-thunk';
import { createStore } from 'redux';

describe('react-redux app shallow test(Todo app)', () => {
  const initState = {
    todoAll: [
      {
        id: shortid.generate(),
        text: 'test',
        complete: false,
      },
    ],
  };
  //let mockStore;
  let container, store;

  // 填写新的任务的函数
  function InputContent(container) {
    container
      .find('.todo-container')
      .childAt(0)
      .props()
      .onChange({ target: { value: 'my new todo value' } });
  }

  beforeEach(() => {
    //mockStore = configureStore([thunk])(initState);
    store = createStore((state = initState, action) => {
      switch (action.type) {
        case 'TODO_ADD':
          return {
            todoAll: state.todoAll.concat({
              id: shortid.generate(),
              text: action.text,
              complete: false,
            }),
          };
        default:
          return state;
      }
    });
    container = mount(
      <Provider store={store}>
        <Todo type="all" />
      </Provider>
    );
  });

  // TODO组件正确渲染完了
  it('connected Todo has rendered', () => {
    console.log('jjjj');
    expect(container.length).toEqual(1);
  });

  // 输入 待办事项内容;
  it('input todo task content', () => {
    InputContent(container);
    const node = container.find('Index').instance().state;
    expect(node).toEqual({ task: 'my new todo value' });
  });

  // 点击增加任务
  it('click add Button', () => {
    // InputContent(container);
    //container.find('Button').at(0).simulate('click');
    const {
      Addtodo,
      todo: { todoAll },
    } = container.find('Index').props();
    store.dispatch(Addtodo('ddfkjdk'));
    console.log('todoAll', store.getState());
    expect(todoAll).toEqual('my new todo value');
  });
});
