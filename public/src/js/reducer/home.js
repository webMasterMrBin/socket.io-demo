// 组件全局的state
const initialState = {
  windowOpen: false, // 是否打开错误提示的弹框
  errMsg: "", // api接口报错的信息
  messageOpen: false, // 请求成功提示组件
  doneMsg: "" // 请求结束的提示信息
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "WINDOW_OPEN":
      return Object.assign({}, state, {
        windowOpen: action.windowOpen,
        errMsg: action.errMsg
      });
    case "WINDOW_CLOSE":
      return Object.assign({}, state, {
        windowOpen: action.windowOpen
      });
    case "MESSAGE_OPEN":
      return Object.assign({}, state, {
        messageOpen: action.messageOpen,
        doneMsg: action.doneMsg
      });
    case "MESSAGE_CLOSE":
      return Object.assign({}, state, {
        messageOpen: action.messageOpen
      });
    default:
      return state;
  }
};
