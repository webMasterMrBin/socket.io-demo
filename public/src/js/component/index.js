import { connect } from "react-redux";
import WindowOpen from "./public/windowOpen";

class App extends React.Component {
  render() {
    const { home: { windowOpen, errMsg } } = this.props;
    return (
      <div>
        欢迎访问我的项目demo
        {this.props.children}
        {windowOpen && <WindowOpen error={errMsg} />}
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    home: state.home
  })
)(App);
