import * as ajax from "./lib/ajax";

export function Register(value) {
  return dispatch => {
    return ajax.post(dispatch, {
      url: "/api/register",
      data: JSON.stringify(value),
      success: d => {
        console.log("请求结束后 返回的数据", d);
        dispatch({
          type: "MESSAGE_OPEN",
          messageOpen: true,
          doneMsg: d
        });
      }
    });
  };
}

export function Login(value) {
  return dispatch => {
    return ajax.post(dispatch, {
      url: "/api/login",
      data: JSON.stringify(value),
      success: d => {
        console.log("请求结束后 返回的数据", d);
      }
    });
  };
}
