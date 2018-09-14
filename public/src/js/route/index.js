import Demo from "component/reduxDemo";
import App from "component/index";
import login from "./login";
import NotFound from "./404";
import file from "./file";
import chat from "./chat";
import { newComponent } from "./hoc";

const Test = () => <div>66444test111111122222</div>;

const routes = [
  {
    path: "/",
    component: App,
    indexRoute: {
      component: Test
    },
    childRoutes: [
      {
        path: "demo",
        component: Demo
      },
      {
        path: "hoc",
        component: newComponent
      },
      file,
      chat
    ]
  },
  login,
  NotFound
];

export { routes };
