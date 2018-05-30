import { Router, browserHistory } from "react-router";
import Demo from "component/reduxDemo";
import { child } from "./child";
import NotFound from "./404";

const Test = () => <div>test</div>

const routes = [
  {
    path: "/",
    component: Demo,
    indexRoute: {
      component: Test
    },
    childRoutes: [child]
  },
  NotFound
];

export { routes };
