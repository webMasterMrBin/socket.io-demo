import { Router, browserHistory } from "react-router";
import Demo from "component/reduxDemo";
import { child } from "./child";

const Test = () => <div>test</div>

const routes = {
  path: "/",
  component: Demo,
  indexRoute: {
    component: Test
  },
  childRoutes: [
    child
  ]
};

export { routes };
