import { Router, browserHistory } from "react-router";
import Demo from "component/reduxDemo";
import App from "component/index";
import login from "./login";
import NotFound from "./404";
import file from "./file";
import { newComponent } from "./hoc";

const Test = () => <div>test</div>;

const { Provider, Consumer } = React.createContext("defaultValue");

class Child extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      suck: 5
    }
    console.log("child 实例化");
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("child getDerivedStateFromProps nextprops", nextProps);
    console.log("child getDerivedStateFromProps prevstate", prevState);
    return null
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log("child componentWillReceiveProps", nextProps);
  // }

  // shouldComponentUpdate() {
  //   return false
  // }

  render() {
    console.log("子组件开始渲染");
    console.log("child this.props", this.props);
    return (
      <div>
        count {this.props.parentState}
        <button onClick={() => this.setState({ suck: 6 })}>change child state</button>
      </div>
    )
  }
}

const ChildFunc = () => {
  console.log("now child render");
  return <div>jjjjjj</div>;
}

function Ff(props) {
  console.log("props", props);
  return <Consumer>{value => <div>{value}</div>}</Consumer>;
}

function Kk(props) {
  return <div><Ff tmp="tmp" /></div>
}

class Lifecycle extends React.Component {
  state = {
    count: 0
  };

  // static defaultProps = {
  //   name: "default"
  // };

  // componentWillMount() {
  //   console.log("componentWillMount");
  //   this.setState({ count: 1 });
  // }
  //
  // componentDidMount() {
  //   console.log("componentDidMount");
  // }
  //
  // shouldComponentUpdate() {
  //   console.log("shouldComponentUpdate");
  //   return true;
  // }
  //
  // componentWillReceiveProps() {
  //   console.log("componentWillReceiveProps");
  // }
  //
  // componentWillUpdate() {
  //   console.log("componentWillUpdate");
  // }
  //
  // componentDidUpdate() {
  //   console.log("componentDidUpdate");
  // }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("getDerivedStateFromProps nextprops", nextProps);
    console.log("getDerivedStateFromProps prevstate", prevState);
    return null
  }

  render() {
    console.log("父组件开始渲染");
    return (
      <div>
        {this.props.name || "空"}state:{this.state.count}
        <Child />
        <button onClick={() => this.setState({ count: this.state.count })}>change state</button>
      </div>
    );
    // return (
    //   <Provider value="gg">
    //     count: {this.state.count}
    //     <button onClick={() => this.setState({ count: this.state.count + 1 })}>change state</button>
    //     <Kk />
    //   </Provider>
    // )
  }
}

const fuck = () => <Lifecycle />

const routes = [
  {
    path: "/",
    component: App,
    indexRoute: {
      component: Test
    },
    childRoutes: [
      {
        path: "lifecycle",
        component: fuck
      },
      {
        path: "demo",
        component: Demo
      },
      {
        path: "hoc",
        component: newComponent
      },
      file
    ]
  },
  login,
  NotFound
];

export { routes };
