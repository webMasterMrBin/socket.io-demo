const initialState = {
  message: [] // [{ user: content }]
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_MESSAGE":
      return Object.assign({}, state, {
        message: state.message.concat([
          {
            [action.user]: action.message
          }
        ])
      });
    default:
      return state;
  }
};
