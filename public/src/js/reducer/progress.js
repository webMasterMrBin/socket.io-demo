const initialState = {
  progressOpen: false, // 下载进度组件
  fileProgress: {} // {fileName: percent}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "PROGRESS_OPEN": {
      return {
        ...state,
        progressOpen: action.progressOpen,
        fileProgress: {
          ...state.fileProgress,
          [action.fileName]: 0
        }
      };
    }

    case "PROGRESS_INCREASE": {
      return {
        ...state,
        fileProgress: {
          ...state.fileProgress,
          [action.fileName]: action.percent
        }
      };
    }

    case "PROGRESS_DONE": {
      return {
        ...state,
        fileProgress: {
          ...state.fileProgress,
          [action.fileName]: 100
        }
      };
    }

    case "PROGRESS_CLOSE":
      return Object.assign({}, state, {
        progressOpen: action.progressOpen
      });
    default:
      return state;
  }
};
