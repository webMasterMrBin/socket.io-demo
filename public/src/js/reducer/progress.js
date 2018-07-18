const initialState = {
  progressOpen: false, // 下载进度组件
  fileProgress: [] // { percent: 0, fileName: "" }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "PROGRESS_OPEN": {
      return Object.assign({}, state, {
        progressOpen: action.progressOpen,
        fileProgress: [
          ...state.fileProgress,
          { ...{ fileName: action.fileName, percent: 0 } }
        ]
      });
    }

    case "PROGRESS_INCREASE": {
      const fk = _.cloneDeep(state.fileProgress);
      _.forEach(fk, o => {
        if (o.fileName === action.fileName) {
          o.percent = action.percent;
        }
      });

      return {
        ...state,
        fileProgress: fk
      };
    }

    case "PROGRESS_DONE": {
      const fk = _.cloneDeep(state.fileProgress);
      _.forEach(fk, o => {
        if (o.fileName === action.fileName) {
          o.percent = 100;
        }
      });

      return {
        ...state,
        fileProgress: fk
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
