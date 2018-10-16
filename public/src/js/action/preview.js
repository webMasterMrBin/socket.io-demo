function PreviewOpen(fileName, preType) {
  return dispatch => {
    return dispatch({
      type: 'PREVIEW_OPEN',
      fileName,
      preType
    });
  };
}

function PreviewClose() {
  return dispatch => {
    return dispatch({
      type: 'PREVIEW_CLOSE'
    });
  };
}

export { PreviewOpen, PreviewClose };
