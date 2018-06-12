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
  }
};

// params: URL, BODY, SUCCESS(fetch成功 执行的函数)
// options: 对应fetch 的第二个参数init
const ajax = (dispatch, params, options) => {
  // 请求发起loading
  dispatch({ type: "HTTP_LOADING", apiName: params.url });

  // 设置fetch timeout
  const delay = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("接口超时");
    }, 3000);
  });

  return (async () => {
    try {
      const res = await Promise.race([fetch(params.url, options), delay]);
      console.log("res", res);
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
      // 输出reject的错误 (接口超时的处理)
      dispatch({
        type: "WINDOW_OPEN",
        windowOpen: true,
        errMsg: err
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

export { get, post };
