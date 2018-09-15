function UpdateMessage(v) {
  return dispatch => {
    return dispatch({
      type: "UPDATE_MESSAGE",
      message: v.message,
      user: v.user
    });
  };
}

export { UpdateMessage };
