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
        // 登陆成功
        if (d.status === 1) {
          browserHistory.replace("/");
          dispatch({
            type: "MESSAGE_OPEN",
            messageOpen: true,
            doneMsg: d.msg
          });
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
      }
    });
  };
};

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
