// 全局组件的action 比如windowopen, messageOpen
function WindowOpenConfirm(confirmMsg, confirmFunc) {
  return dispatch => {
    return dispatch({
      type: "WINDOW_OPEN",
      confirm: true,
      confirmMsg,
      windowOpen: true,
      confirmFunc
    });
  };
}

export { WindowOpenConfirm };
