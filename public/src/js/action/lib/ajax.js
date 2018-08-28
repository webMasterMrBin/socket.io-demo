// fetch 改写ajax
// (自定义的fetch)
// 功能暂定 错误处理, 网络超时处理, progress

const optionMap = {
  get: {
    method: "get",
    mod: "cors", // 同域和带有cors头的跨域请求可成功请求
    credentials: "include" // 跨域请求发cookie
  },
  post: {
    method: "post",
    credentials: "include",
    headers: {
      "content-type": "application/json;charset=UTF-8"
    }
  },
  put: {
    method: "put",
    credentials: "include",
    headers: {
      "content-type": "application/json;charset=UTF-8"
    }
  },
  delete: {
    method: "delete",
    credentials: "include",
    headers: {
      "content-type": "application/json;charset=UTF-8"
    }
  },
  upload: {
    method: "post",
    credentials: "include",
    progress: true // 代表是上传文件操作需要显示进度条
  }
};

// params: URL, BODY, SUCCESS(fetch成功 执行的函数)
// options: 对应fetch 的第二个参数init
const ajax = (dispatch, params, options) => {
  // 请求发起loading
  dispatch({ type: "HTTP_LOADING", apiName: params.url });

  // fetch progress(只支持get请求response.body)
  /*
    NOTE 流模式readable streams 参考https://jakearchibald.com/2016/streams-ftw/
  */
  /*
  if (options.progress) {
    fetch(params.url, options).then(res => {
      const reader = res.body.getReader();
      let bytesReceived = 0;
      return reader.read().then(function processResult(result) {
        // Result objects contain two properties:
        // done  - true if the stream has already given
        //         you all its data.
        // value - some data. Always undefined when
        //         done is true.
        if (result.done) {
          console.log("fetch done");
          return;
        }

        bytesReceived += result.value.length;
        console.log("Received", bytesReceived, "bytes of data so far");

        // keep reading, read more
        return reader.read().then(processResult);
      });
    });
  }
  */

  // if (options.progress) {
  //   console.log("options", options);
  //   const fileName = options.body.get("file").name
  //
  //   const uploadProgress = e => {
  //     if (e.lengthComputable) {
  //       const percent = Math.round(e.loaded / e.total * 100);
  //       dispatch({
  //         type: "PROGRESS_INCREASE",
  //         percent,
  //         fileName
  //       });
  //     }
  //   };
  //
  //   // xhr实现文件上传progress
  //   const fetchProgress = (url, options) => {
  //     return new Promise((resolve, reject) => {
  //       const xhr = new XMLHttpRequest();
  //       xhr.open(options.method, url);
  //       // 设置请求头
  //       _.forEach(options.headers, (o, i) => {
  //         xhr.setRequestHeader(i, o);
  //       });
  //       xhr.onloadstart = () => {
  //         console.log("响应开始 收到第一个字节");
  //         // 打开下载进度组件框
  //         dispatch({
  //           type: "PROGRESS_OPEN",
  //           progressOpen: true,
  //           fileName
  //         });
  //       };
  //       xhr.onload = e => {
  //         console.log("响应结束 已经收到完整的响应数据");
  //         resolve(e.target.responseText);
  //       };
  //       xhr.onerror = reject;
  //       xhr.upload.onprogress = uploadProgress;
  //       xhr.onreadystatechange = e => {
  //         if (e.target.readyState === 4) {
  //           dispatch({
  //             type: "PROGRESS_DONE",
  //             fileName
  //           });
  //           dispatch({ type: "HTTP_SUCCESS", apiName: params.url });
  //           params.success(JSON.parse(e.target.responseText));
  //         }
  //       };
  //       xhr.send(options.body);
  //       console.log("xhr", xhr);
  //       // 确保有返回值切为promise
  //       if (xhr.responseText) {
  //         return resolve(JSON.parse(xhr.responseText));
  //       }
  //     });
  //   };
  //   return fetchProgress(params.url, options);
  // }

  return (async () => {
    try {
      // 设置fetch timeout
      const delay = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject("接口超时");
        }, 50000);
      });
      const res = await Promise.race([fetch(params.url, options), delay]);
      // http成功的dispatch
      dispatch({ type: "HTTP_SUCCESS", apiName: params.url });
      const json = await res.json();
      // 状态码400至500 的页面上响应错误提示
      if (res.status >= 400 && res.status <= 500) {
        dispatch({
          type: "WINDOW_OPEN",
          windowOpen: true,
          errMsg: json.msg
        });
      } else {
        // 执行请求成功的函数
        params.success(json);
      }

      // 确保ajax fetch 有返回值 且返回值为promise
      return json;
    } catch (err) {
      console.log("err", err);
      // 输出reject的错误 (接口超时的处理)
      dispatch({
        type: "WINDOW_OPEN",
        windowOpen: true,
        errMsg: "something wrong"
      });
    }
  })();
};

// get请求
const get = (dispatch, params) => {
  return ajax(dispatch, params, optionMap.get);
};

const post = (dispatch, params) => {
  optionMap.post.body = params.data;
  return ajax(dispatch, params, optionMap.post);
};

const upload = (dispatch, params) => {
  optionMap.upload.body = params.data;
  return ajax(dispatch, params, optionMap.upload);
};

const remove = (dispatch, params) => {
  optionMap.delete.body = params.data;
  return ajax(dispatch, params, optionMap.delete);
};

export { get, post, upload, remove };
