import Demo from "component/reduxDemo";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { rootReducer } from "./reducer";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import promiseMiddleware from "redux-promise";
import { Provider } from "react-redux";
import { reducer as formReducer } from "redux-form";
import { Router, browserHistory, Route } from "react-router";
import { routes } from "./route";

const reducers = combineReducers({
  form: formReducer,
  rootReducer
});

const store = createStore(reducers, applyMiddleware(thunk, promiseMiddleware, createLogger({collapsed: true})));

console.log("初始化 getState", store.getState());

// 每次 state 更新时，打印日志
// 注意 subscribe() 返回一个函数用来注销监听器
const unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

ReactDOM.render(
	<Provider store={store}>
    <Router history={browserHistory} routes={routes} />
	</Provider>, document.getElementById('global')
);
