import { connect } from "react-redux";
import WindowOpen from "./public/windowOpen";
import MessageOpen from "./public/messageOpen";

class App extends React.Component {
  render() {
    const { home: { windowOpen, errMsg, messageOpen, doneMsg } } = this.props;
    return (
      <div>
        欢迎访问我的项目demo
        {this.props.children}
        {windowOpen && <WindowOpen error={errMsg} />}
        {messageOpen && <MessageOpen doneMsg={doneMsg} />}
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    home: state.home
  })
)(App);
