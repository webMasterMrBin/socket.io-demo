import { Router, browserHistory } from "react-router";
import Demo from "component/reduxDemo";
import App from "component/index";
import login from "./login";
import NotFound from "./404";
import file from "./file";

const Test = () => <div>test</div>;

class Child extends React.Component {
  state: {
    suck: 5
  }

  componentWillMount() {
    console.log("child componentWillMount");
    this.setState({ count: 1 });
  }

  componentDidMount() {
    console.log("child componentDidMount");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("child shouldComponentUpdate");
    if (nextProps.parentState !== this.props.parentState) {
      // props中parentstate 更改了则子组件进入更新状态 发生重渲
      return true;
    }
    return true;
  }

  componentWillReceiveProps(nextProps) {
    console.log("child componentWillReceiveProps");
    console.log("child nextProps", nextProps);
  }

  componentWillUpdate() {
    console.log("child componentWillUpdate");
  }

  componentDidUpdate() {
    console.log("child componentDidUpdate");
  }

  render() {
    console.log("子组件开始渲染");
    return (
      <div>
        child name{this.props.name} parent count {this.props.parentState}
        <button onClick={() => this.setState({ suck: 6 })}>change child state</button>
      </div>
    )
  }
}



class Lifecycle extends React.Component {
  state = {
    count: 0
  };

  // static defaultProps = {
  //   name: "default"
  // };

  componentWillMount() {
    console.log("componentWillMount");
    this.setState({ count: 1 });
  }

  componentDidMount() {
    console.log("componentDidMount");
  }

  shouldComponentUpdate() {
    console.log("shouldComponentUpdate");
    return true;
  }

  componentWillReceiveProps() {
    console.log("componentWillReceiveProps");
  }

  componentWillUpdate() {
    console.log("componentWillUpdate");
  }

  componentDidUpdate() {
    console.log("componentDidUpdate");
  }

  render() {
    console.log("父组件开始渲染");
    return (
      <div>
        {this.props.name || "空"}state:{this.state.count}
        <Child />
        <button onClick={() => this.setState({ count: 2 })}>change state</button>
      </div>
    );
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
      file
    ]
  },
  login,
  NotFound
];

export { routes };
