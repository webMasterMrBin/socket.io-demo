const initialState = {
  files: [], // 保存当前用户files信息
  uploadChunks: [], // 已上传的chunks
  fileExis: false // 文件是否存在且信息存到mongo
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "FILE_LIST":
      return Object.assign({}, state, {
        files: action.res.fileList
      });
    case "FILE_CHUNKS":
      return {
        ...state,
        uploadChunks: [...state.uploadChunks, ...action.res.uploadChunks],
        fileExis: action.res.exis
      };
    default:
      return state;
  }
};
