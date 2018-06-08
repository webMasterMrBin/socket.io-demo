const initialState = {
  userName: ""
}

export function rootReducer(state = initialState, action) {
  return Object.assign({}, state, {
    userName: action.userName
  });
};
