import { createStore, combineReducers, applyMiddleware } from 'redux';
import { user } from './reducer/user';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import promiseMiddleware from 'redux-promise';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import { Router, browserHistory } from 'react-router';
import { routes } from './route';
import http from './reducer/http';
import home from './reducer/home';
import file from './reducer/file';
import chat from './reducer/chat';
import progress from './reducer/progress';
import preview from './reducer/preview';
import todo from './reducer/todo';
import mockup from './reducer/mockup';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  uri: `http://localhost:4001/api/graphql`,
  onError() {
    console.log('graphQL error!!');
  },
});

if (NODE_ENV !== 'production') {
  import('../less/index.less');
}

// less文件更新HMR
if (module.hot) {
  module.hot.accept('../less/index.less', () => {
    //console.log("less文件更新了");
  });
}

const reducers = combineReducers({
  form: formReducer,
  user,
  http,
  home,
  file,
  progress,
  chat,
  preview,
  todo,
  mockup,
});

const store = createStore(
  reducers,
  NODE_ENV !== 'production'
    ? applyMiddleware(
        thunk,
        promiseMiddleware,
        createLogger({ collapsed: true })
      )
    : applyMiddleware(thunk, promiseMiddleware)
);

// 开发环境查看state初始值
//console.log("初始化 getState", store.getState());

// 每次 state 更新时，打印日志
// 注意 subscribe() 返回一个函数用来注销监听器
NODE_ENV !== 'production' &&
  store.subscribe(() => console.log(store.getState()));

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <Router history={browserHistory} routes={routes} />
    </Provider>
  </ApolloProvider>,
  document.getElementById('global')
);
