import * as ajax from "./lib/ajax";
import { browserHistory } from "react-router";
export * from "./home";

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
        // 上传了一片(文件小于切片的大小)
        if (formData.get("total") === "1") {
          dispatch({
            type: "FILE_CHUNKS",
            res: d
          });
          // 合并完文件后
          dispatch(ListFiles(formData.get("webkitRelativePath")));
        }
      }
    });
  };
}

// 检验文件md5判断是否上传过
function CheckMd5(md5, fileSize) {
  return dispatch => {
    return ajax.get(dispatch, {
      url: `/api/fileMd5?md5=${md5}&fileSize=${fileSize}`,
      success(d) {
        dispatch({
          type: "FILE_CHUNKS",
          res: d
        });
      }
    });
  };
}

// 上传完所有chunks请求合并文件
function MergeFile(data) {
  return dispatch => {
    return ajax.post(dispatch, {
      url: "/api/merge",
      data: JSON.stringify(data),
      success(d) {
        dispatch({
          type: "FILE_CHUNKS",
          res: d
        });
        // 合并完文件后
        dispatch(ListFiles(data.webkitRelativePath));
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
  CheckMd5,
  MergeFile
};
