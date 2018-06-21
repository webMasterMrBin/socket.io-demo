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
        console.log("上传请求done");
      }
    });
  };
}

export { Upload, ListFiles }
