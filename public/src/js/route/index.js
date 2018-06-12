import { Router, browserHistory } from "react-router";
import Demo from "component/reduxDemo";
import App from "component/index";
import login from "./login";
import NotFound from "./404";

const Test = () => <div>test</div>;

const routes = [
  {
    path: "/",
    component: App,
    indexRoute: {
      component: Test
    }
  },
  login,
  NotFound
];

export { routes };
