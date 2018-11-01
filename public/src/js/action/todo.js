export function Todochange(id, complete) {
  return dispatch => {
    return dispatch({
      id,
      type: 'TODO_CHANGE',
      complete,
    });
  };
}

export function Addtodo(text) {
  return dispatch => {
    return dispatch({
      type: 'TODO_ADD',
      text,
      complete: false,
    });
  };
}

export function Deletetodo(id) {
  return dispatch => {
    return dispatch({
      type: 'TODO_DELETE',
      id,
    });
  };
}
