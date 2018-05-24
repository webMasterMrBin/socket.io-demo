import Login from "component/login";
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { rootReducer } from './reducer';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import promiseMiddleware from 'redux-promise';
import { Provider } from 'react-redux';

const reducers = combineReducers({
	rootReducer
});

const store = createStore(reducers, applyMiddleware(thunk, promiseMiddleware, createLogger()));

console.log("初始化 getState", store.getState());

// 每次 state 更新时，打印日志
// 注意 subscribe() 返回一个函数用来注销监听器
const unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

ReactDOM.render(
	<Provider store={store}>
		<Login />
	</Provider>, document.getElementById('global')
);
