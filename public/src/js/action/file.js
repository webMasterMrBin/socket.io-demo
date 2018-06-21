import * as ajax from "./lib/ajax";
import { browserHistory } from "react-router";

function ListFiles() {
  return dispatch => {
    return ajax.get(dispatch, {
      url: "/api/files",
      success: d => {
        dispatch({
          type: "FILE_LIST",
          res: d
        });
      }
    });
  };
}

function Upload(formData) {
  return dispatch => {
    return ajax.upload(dispatch, {
      url: "/api/upload",
      data: formData,
      success: d => {
        dispatch(ListFiles());
      }
    });
  };
}

function RemoveFile(path, name) {
  return dispatch => {
    return ajax.remove(dispatch, {
      url: `/api/file?filePath=${path}&name=${name}`,
      success: d => {
        dispatch(ListFiles());
        dispatch({
          type: "MESSAGE_OPEN",
          messageOpen: true,
          doneMsg: d.msg
        });
      }
    });
  };
}

export { Upload, ListFiles, RemoveFile }
