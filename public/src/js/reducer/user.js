const initialState = {
  userName: ""
};

export function user(state = initialState, action) {
  switch (action.type) {
    case "USER_LIST":
      return Object.assign({}, state, {
        userName: action.res.userName
      });
    default:
      return state;
  }
}
