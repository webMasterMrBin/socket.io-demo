import shortid from 'shortid';

const initialState = {
  /*[{
    id: '',
    text: '',
    complete: false
  }]*/
  todoAll: JSON.parse(window.localStorage.getItem('todo')) || [
    {
      id: shortid.generate(),
      text: 'test',
      complete: false,
    },
  ],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'TODO_CHANGE':
      return Object.assign({}, state, {
        todoAll: state.todoAll.concat([
          {
            [action.id]: action.id,
            complete: action.complete,
          },
        ]),
      });
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
