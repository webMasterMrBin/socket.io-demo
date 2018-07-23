const initialState = {
  apiName: "", // 接口名字
  loading: {} // 判断某个api接口loading状态 e.g {"/api/list": true}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "HTTP_LOADING":
      return Object.assign({}, state, {
        apiName: action.apiName,
        loading: true
      });
    case "HTTP_SUCCESS":
      return Object.assign({}, state, {
        apiName: action.apiName,
        loading: false
      });
    default:
      return state;
  }
};
