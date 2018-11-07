import shortid from 'shortid';

const todoAll = _.get(
  window.localStorage.getItem('todo')
    ? JSON.parse(window.localStorage.getItem('todo'))
    : {},
  'todoAll'
);

const initialState = {
  /*[{
    id: '',
    text: '',
    complete: false
  }]*/
  todoAll: todoAll || [
    {
      id: shortid.generate(),
      text: 'test',
      complete: false,
    },
  ],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'TODO_CHANGE': {
      return {
        todoAll: state.todoAll.map(
          o =>
            o.id === action.id
              ? { id: action.id, text: o.text, complete: action.complete }
              : o
        ),
      };
    }
    case 'TODO_ADD':
      return {
        todoAll: state.todoAll.concat([
          {
            id: shortid.generate(),
            text: action.text,
            complete: false,
          },
        ]),
      };
    case 'TODO_DELETE':
      return {
        todoAll: state.todoAll.filter(o => o.id !== action.id),
      };
    default:
      return state;
  }
};
