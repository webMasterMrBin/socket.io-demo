import { Input } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as action from "action/chat";
import { socket } from "lib/realtime";
import PropTypes from "prop-types";

function SendMessage(v, user) {
  socket.emit("sendchat", { message: v, user });
}

const TextInput = ({ user }) => {
  return (
    <div>
      <Input
        placeholder="输入内容"
        onPressEnter={e => SendMessage(e.target.value, user)}
      />
    </div>
  );
};

const ChatBox = ({ message }) => {
  return (
    <div className="chat-box">
      {!_.isEmpty(message) &&
        message.map((o, i) => (
          <div className="chat-item" key={i}>
            <div className="chat-user">{Object.keys(o)[0]}</div>
            <div className="chat-content">{Object.values(o)[0]}</div>
          </div>
        ))}
    </div>
  );
};

class Index extends React.Component {
  state = {
    user: ""
  };

  componentDidMount() {
    const { UpdateMessage } = this.props;
    socket.on("sendchat", data => {
      UpdateMessage(data);
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const userName = _.get(nextProps, "user.userName");
    if (userName !== prevState.user) {
      return {
        user: userName
      };
    }
    return null;
  }

  render() {
    const {
      chat: { message }
    } = this.props;
    return (
      <div className="chat-container">
        <ChatBox message={message} />
        <TextInput user={this.state.user} />
      </div>
    );
  }
}

Index.propTypes = {
  UpdateMessage: PropTypes.func,
  message: PropTypes.array,
  chat: PropTypes.object
};

module.exports = connect(
  state => state,
  dispatch => bindActionCreators(action, dispatch)
)(Index);
