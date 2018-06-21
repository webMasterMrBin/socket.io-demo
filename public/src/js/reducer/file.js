const initialState = {
  files: [] // 保存当前用户files信息
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "FILE_LIST":
      return Object.assign({}, state, {
        files: action.res.fileList
      });
    default:
      return state;
  }
};
