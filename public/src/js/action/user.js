import * as ajax from "./lib/ajax";
import { browserHistory } from "react-router";

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
          doneMsg: d.msg
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
        dispatch({
          type: "MESSAGE_OPEN",
          messageOpen: true,
          doneMsg: d.msg
        });
        // 登陆成功
        if (d.status) {
          browserHistory.replace("/");
        }
      }
    });
  };
}

export function Logout() {
  return dispatch => {
    return ajax.get(dispatch, {
      url: "/api/logout",
      success: d => {
        dispatch({
          type: "MESSAGE_OPEN",
          messageOpen: true,
          doneMsg: d.msg
        });
        if (d.status) {
          browserHistory.replace("/login");
        }
      }
    });
  };
}

export function GetId() {
  return dispatch => {
    return ajax.get(dispatch, {
      url: "/api/getID",
      success: d => {
        dispatch({
          type: "MESSAGE_OPEN",
          messageOpen: true,
          doneMsg: d
        });
      }
    });
  };
}

export function GetUser() {
  return dispatch => {
    return ajax.get(dispatch, {
      url: "/api/user",
      success: d => {
        console.log("user d", d);
        if (d.status) {
          dispatch({
            type: "USER_LIST",
            res: d.userInfo
          });
        } else {
          dispatch({
            type: "WINDOW_OPEN",
            windowOpen: true,
            errMsg: d.msg
          });
        }
      }
    });
  };
}
