const initialState = {
  text: "",
  isFetching: ""
};

export function rootReducer(state = initialState, action) {
  return Object.assign({}, state, {
    text: action.text || "",
    isFetching: action.isFetching || false
  });
}
