import * as ajax from "./lib/ajax";
import { browserHistory } from "react-router";
import { WindowOpenConfirm } from "./home";

function ListFiles(path) {
  return dispatch => {
    return ajax.get(dispatch, {
      url: `/api/files?path=${path}`,
      success: d => {
        dispatch({
          type: "FILE_LIST",
          res: d
        });
      }
    });
  };
}

function Upload(formData, path) {
  return dispatch => {
    return ajax.upload(dispatch, {
      url: `/api/upload?path=${path}`,
      data: formData,
      success: d => {
        dispatch(ListFiles(path));
        dispatch({
          type: "MESSAGE_OPEN",
          messageOpen: true,
          doneMsg: d.msg
        });
      }
    });
  };
}

function RemoveFile(path, name, webkitRelativePath) {
  return dispatch => {
    return ajax.remove(dispatch, {
      url: `/api/file?filePath=${path}&name=${name}`,
      success: d => {
        dispatch(ListFiles(webkitRelativePath));
        dispatch({
          type: "MESSAGE_OPEN",
          messageOpen: true,
          doneMsg: d.msg
        });
        dispatch({
          type: "WINDOW_CLOSE",
          windowOpen: false
        });
      }
    });
  };
}

function CreateDir(v) {
  return dispatch => {
    if (!v.directoryName) {
      dispatch({
        type: "WINDOW_OPEN",
        windowOpen: true,
        errMsg: "文件夹名称不得为空"
      });
      return Promise.resolve();
    } else {
      return ajax.post(dispatch, {
        url: `/api/directory`,
        data: JSON.stringify(v),
        success: d => {
          dispatch(ListFiles(v.webkitRelativePath));
          dispatch({
            type: "MESSAGE_OPEN",
            messageOpen: true,
            doneMsg: d.msg
          });
        }
      });
    }
  };
}

function RemoveDir(directoryName, webkitRelativePath) {
  return dispatch => {
    return ajax.remove(dispatch, {
      url: `/api/directory?directoryName=${directoryName}&webkitRelativePath=${webkitRelativePath}`,
      success: d => {
        dispatch(ListFiles(webkitRelativePath));
        dispatch({
          type: "MESSAGE_OPEN",
          messageOpen: true,
          doneMsg: d.msg
        });
        dispatch({
          type: "WINDOW_CLOSE",
          windowOpen: false
        });
      }
    });
  };
}

export {
  Upload,
  ListFiles,
  RemoveFile,
  CreateDir,
  RemoveDir,
  WindowOpenConfirm
};
