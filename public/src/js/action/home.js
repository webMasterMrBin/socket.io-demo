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

function ProgressOpen(fileName, chunk) {
  // chunk 已经上传的分片序号
  return dispatch => {
    return dispatch({
      type: "PROGRESS_OPEN",
      progressOpen: true,
      fileName,
      chunk
    });
  };
}

function ProgressIncrease(percent, fileName) {
  return dispatch => {
    return dispatch({
      type: "PROGRESS_INCREASE",
      percent,
      fileName
    });
  };
}

export { WindowOpenConfirm, ProgressOpen, ProgressIncrease };
