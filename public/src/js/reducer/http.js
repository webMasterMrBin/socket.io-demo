const initialState = {
  loading: {} // 判断某个api接口loading状态 e.g {"/api/list": true}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "HTTP_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.apiName]: true
        }
      };
    case "HTTP_SUCCESS":
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.apiName]: false
        }
      };
    default:
      return state;
  }
};
