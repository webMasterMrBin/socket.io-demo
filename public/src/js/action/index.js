// 发起请求
export function RequestPosts(text) {
  return {
    type: 'REQUEST_POSTS',
    isFetching: true,
    text
  };
}

// 收起请求
export function ReceivePosts(text) {
  return {
    type: 'RECEIVE_POSTS',
    isFetching: false,
    text
  };
}

export function List(requestText, receiveText) {
  // XXX(异步action 方案1) redux-thunk的写法 让 Action Creator能返回函数
  return (dispatch, getState) => {
    // 刚发出请求时的state
    console.log('发出请求时初始', getState());
    dispatch(RequestPosts(requestText));
    setTimeout(() => {
      dispatch(ReceivePosts(receiveText));
    }, 2000);
  };

  // XXX(异步action 方案2) redux-promise的写法 直接返回promise对象
  // const result = new Promise((resolve, reject) => {
  //   RequestPosts(requestText);
  //   setTimeout(() => resolve(ReceivePosts(receiveText)), 2000);
  // });
  //
  // console.log("result", result);
  //
  // return result;
}
